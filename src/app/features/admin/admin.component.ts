import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  inject,
  input,
  signal
} from '@angular/core';
import { RouterLink } from '@angular/router';
import { CustomerStatus } from '../../core/models/customer.model';
import { OrderStatus } from '../../core/models/order.model';
import { Product } from '../../core/models/product.model';
import { AdminDataService } from '../../core/services/admin-data.service';
import { AuthService } from '../../core/services/auth.service';
import { ProductService } from '../../core/services/product.service';
import { AdminCustomersTableComponent } from './components/admin-customers-table/admin-customers-table.component';
import { AdminOrdersTableComponent } from './components/admin-orders-table/admin-orders-table.component';
import { AdminProductModalComponent } from './components/admin-product-modal/admin-product-modal.component';
import { AdminProductTableComponent } from './components/admin-product-table/admin-product-table.component';

export type AdminTab = 'products' | 'orders' | 'customers' | 'settings';

@Component({
  selector: 'app-admin',
  imports: [
    RouterLink,
    AdminProductTableComponent,
    AdminProductModalComponent,
    AdminOrdersTableComponent,
    AdminCustomersTableComponent
  ],
  template: `
    <div class="min-h-[calc(100vh-4rem)] bg-[#f5f5f7] text-neutral-900 flex flex-col lg:flex-row">
      <header class="lg:hidden bg-[#101010] text-white px-4 py-3 border-b border-neutral-800 flex items-center justify-between">
        <div class="flex items-center gap-2.5">
          <img
            src="/assets/LOGO-SKYTEC.avif"
            alt="SKYTEC"
            class="h-6 w-auto object-contain"
          />
          <div>
            <span class="text-xs font-mono font-bold tracking-wider uppercase text-neutral-300 block leading-tight">
              Admin
            </span>
            <span class="text-[10px] text-neutral-400 font-medium block leading-tight">
              {{ currentSectionTitle() }}
            </span>
          </div>
        </div>

        <button
          type="button"
          (click)="toggleMobileSidebar()"
          [attr.aria-expanded]="isMobileSidebarOpen()"
          aria-controls="admin-sidebar"
          aria-label="Alternar menu administrativo"
          class="p-2 text-neutral-300 hover:text-white hover:bg-neutral-800 rounded-lg transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#077fbd] cursor-pointer"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            class="w-5 h-5"
            aria-hidden="true"
          >
            <line x1="4" x2="20" y1="12" y2="12" />
            <line x1="4" x2="20" y1="6" y2="6" />
            <line x1="4" x2="20" y1="18" y2="18" />
          </svg>
        </button>
      </header>

      @if (isMobileSidebarOpen()) {
        <div
          class="fixed inset-0 bg-black/70 z-40 lg:hidden backdrop-blur-xs transition-opacity duration-200"
          (click)="closeMobileSidebar()"
          aria-hidden="true"
        ></div>
      }

      <aside
        id="admin-sidebar"
        class="bg-[#101010] text-white w-full lg:w-64 lg:min-h-[calc(100vh-4rem)] shrink-0 flex flex-col border-r border-neutral-800 z-50 transition-all duration-200 lg:static fixed inset-y-0 left-0 max-w-xs lg:max-w-none"
        [class.hidden]="!isMobileSidebarOpen()"
        [class.flex]="isMobileSidebarOpen()"
        [class.lg:flex]="true"
        aria-label="Barra Lateral Administrativa"
      >
        <div class="p-4 sm:p-5 border-b border-neutral-800 flex items-center justify-between">
          <div class="flex items-center gap-3">
            <img
              src="/assets/LOGO-SKYTEC.avif"
              alt="SKYTEC"
              class="h-7 w-auto object-contain"
            />
            <span class="text-[10px] text-neutral-400 font-mono tracking-wider uppercase block leading-tight px-1.5 py-0.5 rounded bg-neutral-800/80 border border-neutral-700/50">
              Admin
            </span>
          </div>

          <button
            type="button"
            (click)="closeMobileSidebar()"
            class="lg:hidden p-1.5 text-neutral-400 hover:text-white rounded-md hover:bg-neutral-800 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#077fbd]"
            aria-label="Fechar menu administrativo"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
              class="w-5 h-5"
            >
              <path d="M18 6 6 18" />
              <path d="m6 6 12 12" />
            </svg>
          </button>
        </div>

        <div class="px-4 py-3 border-b border-neutral-800/80 bg-neutral-950/40 flex items-center justify-between">
          <div class="flex items-center gap-2">
            <span class="w-2 h-2 rounded-full bg-emerald-400 ring-2 ring-emerald-400/20" aria-hidden="true"></span>
            <span class="text-[11px] font-semibold text-neutral-300">Modo Local (Signals)</span>
          </div>
          <span class="text-[10px] bg-neutral-800 text-neutral-300 font-mono px-2 py-0.5 rounded border border-neutral-700">
            Zero Latency
          </span>
        </div>

        <nav aria-label="Menu Administrativo" class="flex-1 px-3 py-4 space-y-1.5 overflow-y-auto">
          <button
            type="button"
            (click)="selectTab('products')"
            [attr.aria-current]="activeTab() === 'products' ? 'page' : null"
            class="w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer select-none text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#077fbd]"
            [class.bg-[#077fbd]]="activeTab() === 'products'"
            [class.text-white]="activeTab() === 'products'"
            [class.shadow-xs]="activeTab() === 'products'"
            [class.text-neutral-400]="activeTab() !== 'products'"
            [class.hover:bg-neutral-800]="activeTab() !== 'products'"
            [class.hover:text-white]="activeTab() !== 'products'"
          >
            <div class="flex items-center gap-3">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
                class="w-4 h-4 shrink-0"
                aria-hidden="true"
              >
                <path d="m7.5 4.27 9 5.15" />
                <path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z" />
                <path d="m3.3 7 8.7 5 8.7-5" />
                <path d="M12 22V12" />
              </svg>
              <div>
                <span class="block leading-tight">Produtos</span>
                <span class="text-[10px] opacity-75 font-normal block leading-tight">Catálogo & Estoque</span>
              </div>
            </div>
            <span
              class="text-[11px] font-mono px-2 py-0.5 rounded-full font-bold"
              [class.bg-white/20]="activeTab() === 'products'"
              [class.text-white]="activeTab() === 'products'"
              [class.bg-neutral-800]="activeTab() !== 'products'"
              [class.text-neutral-300]="activeTab() !== 'products'"
            >
              {{ productService.products().length }}
            </span>
          </button>

          <button
            type="button"
            (click)="selectTab('orders')"
            [attr.aria-current]="activeTab() === 'orders' ? 'page' : null"
            class="w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer select-none text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#077fbd]"
            [class.bg-[#077fbd]]="activeTab() === 'orders'"
            [class.text-white]="activeTab() === 'orders'"
            [class.shadow-xs]="activeTab() === 'orders'"
            [class.text-neutral-400]="activeTab() !== 'orders'"
            [class.hover:bg-neutral-800]="activeTab() !== 'orders'"
            [class.hover:text-white]="activeTab() !== 'orders'"
          >
            <div class="flex items-center gap-3">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
                class="w-4 h-4 shrink-0"
                aria-hidden="true"
              >
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                <polyline points="14 2 14 8 20 8" />
                <line x1="16" x2="8" y1="13" y2="13" />
                <line x1="16" x2="8" y1="17" y2="17" />
                <polyline points="10 9 9 9 8 9" />
              </svg>
              <div>
                <span class="block leading-tight">Pedidos & Cotações</span>
                <span class="text-[10px] opacity-75 font-normal block leading-tight">Orçamentos B2B</span>
              </div>
            </div>
            <span
              class="text-[10px] font-mono px-1.5 py-0.5 rounded font-bold"
              [class.bg-white/20]="activeTab() === 'orders'"
              [class.text-white]="activeTab() === 'orders'"
              [class.bg-neutral-800]="activeTab() !== 'orders'"
              [class.text-amber-400]="activeTab() !== 'orders'"
            >
              {{ adminDataService.pendingOrdersCount() }} pendentes
            </span>
          </button>

          <button
            type="button"
            (click)="selectTab('customers')"
            [attr.aria-current]="activeTab() === 'customers' ? 'page' : null"
            class="w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer select-none text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#077fbd]"
            [class.bg-[#077fbd]]="activeTab() === 'customers'"
            [class.text-white]="activeTab() === 'customers'"
            [class.shadow-xs]="activeTab() === 'customers'"
            [class.text-neutral-400]="activeTab() !== 'customers'"
            [class.hover:bg-neutral-800]="activeTab() !== 'customers'"
            [class.hover:text-white]="activeTab() !== 'customers'"
          >
            <div class="flex items-center gap-3">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
                class="w-4 h-4 shrink-0"
                aria-hidden="true"
              >
                <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                <circle cx="9" cy="7" r="4" />
                <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
                <path d="M16 3.13a4 4 0 0 1 0 7.75" />
              </svg>
              <div>
                <span class="block leading-tight">Clientes</span>
                <span class="text-[10px] opacity-75 font-normal block leading-tight">Contas & Empresas</span>
              </div>
            </div>
            <span
              class="text-[11px] font-mono px-2 py-0.5 rounded-full font-bold"
              [class.bg-white/20]="activeTab() === 'customers'"
              [class.text-white]="activeTab() === 'customers'"
              [class.bg-neutral-800]="activeTab() !== 'customers'"
              [class.text-neutral-300]="activeTab() !== 'customers'"
            >
              {{ adminDataService.customers().length }}
            </span>
          </button>

          <button
            type="button"
            (click)="selectTab('settings')"
            [attr.aria-current]="activeTab() === 'settings' ? 'page' : null"
            class="w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer select-none text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#077fbd]"
            [class.bg-[#077fbd]]="activeTab() === 'settings'"
            [class.text-white]="activeTab() === 'settings'"
            [class.shadow-xs]="activeTab() === 'settings'"
            [class.text-neutral-400]="activeTab() !== 'settings'"
            [class.hover:bg-neutral-800]="activeTab() !== 'settings'"
            [class.hover:text-white]="activeTab() !== 'settings'"
          >
            <div class="flex items-center gap-3">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
                class="w-4 h-4 shrink-0"
                aria-hidden="true"
              >
                <line x1="4" x2="20" y1="21" y2="21" />
                <line x1="4" x2="20" y1="14" y2="14" />
                <line x1="4" x2="20" y1="7" y2="7" />
                <circle cx="8" cy="7" r="3" />
                <circle cx="16" cy="14" r="3" />
                <circle cx="10" cy="21" r="3" />
              </svg>
              <div>
                <span class="block leading-tight">Configurações</span>
                <span class="text-[10px] opacity-75 font-normal block leading-tight">Preferências & Dados</span>
              </div>
            </div>
          </button>
        </nav>

        <div class="p-3.5 border-t border-neutral-800 space-y-2.5 bg-neutral-950/30">
          <div class="p-2.5 bg-neutral-900 rounded-lg border border-neutral-800 flex items-center justify-between">
            <div class="overflow-hidden pr-2">
              <span class="text-[11px] font-bold text-white block truncate leading-tight">
                {{ authService.userName() || 'Administrador SKYTEC' }}
              </span>
              <span class="text-[10px] text-neutral-400 font-mono block truncate leading-tight">
                {{ authService.currentUser()?.email || 'admin@skytec.com.br' }}
              </span>
            </div>
            <span class="text-[10px] font-bold uppercase px-1.5 py-0.5 rounded bg-purple-900/60 text-purple-200 border border-purple-700/50">
              Admin
            </span>
          </div>

          <a
            routerLink="/"
            class="w-full inline-flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-neutral-900 hover:bg-neutral-800 text-neutral-300 hover:text-white border border-neutral-800 text-xs font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#077fbd]"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
              class="w-3.5 h-3.5"
              aria-hidden="true"
            >
              <path d="m15 18-6-6 6-6" />
            </svg>
            <span>Voltar para a Loja</span>
          </a>
        </div>
      </aside>

      <main class="flex-1 min-w-0 p-4 sm:p-6 lg:p-8 space-y-6">
        <nav aria-label="Navegação Estrutural" class="text-xs text-neutral-500 flex items-center gap-2 flex-wrap">
          <a
            routerLink="/"
            class="hover:text-neutral-900 transition-colors focus-visible:outline-none focus-visible:underline"
          >
            Início
          </a>
          <span class="text-neutral-400" aria-hidden="true">/</span>
          <span class="text-neutral-600">Painel Administrativo</span>
          <span class="text-neutral-400" aria-hidden="true">/</span>
          <span class="text-neutral-900 font-semibold" aria-current="page">
            {{ currentSectionTitle() }}
          </span>
        </nav>

        <section class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-neutral-200 pb-5">
          <div>
            <div class="flex items-center gap-2.5 mb-1">
              <h1 class="text-2xl sm:text-3xl font-black text-neutral-900 tracking-tight">
                {{ currentSectionTitle() }}
              </h1>
              <span class="px-2 py-0.5 text-xs font-bold rounded-md bg-neutral-200 text-neutral-800">
                Mock B2B
              </span>
            </div>
            <p class="text-xs sm:text-sm text-neutral-600">
              {{ currentSectionDescription() }}
            </p>
          </div>

          <div class="flex items-center gap-2 flex-wrap">
            <div class="px-3 py-1.5 bg-white border border-neutral-200 rounded-lg shadow-2xs flex items-center gap-2 text-xs">
              <span class="text-neutral-500">Catálogo:</span>
              <span class="font-bold text-neutral-900 font-mono">{{ productService.products().length }} máquinas</span>
            </div>
            <div class="px-3 py-1.5 bg-white border border-neutral-200 rounded-lg shadow-2xs flex items-center gap-2 text-xs">
              <span class="text-neutral-500">Marcas:</span>
              <span class="font-bold text-neutral-900 font-mono">{{ productService.brands().length }} ativas</span>
            </div>
          </div>
        </section>

        @switch (activeTab()) {
          @case ('products') {
            <app-admin-product-table
              [products]="productService.products()"
              [brands]="productService.brands()"
              [categories]="productService.categories()"
              (edit)="handleEditProduct($event)"
              (delete)="handleDeleteProduct($event)"
              (create)="handleCreateProduct()"
            />
          }

          @case ('orders') {
            <app-admin-orders-table
              [orders]="adminDataService.orders()"
              (updateStatus)="handleUpdateOrderStatus($event)"
              (deleteOrder)="handleDeleteOrder($event)"
            />
          }

          @case ('customers') {
            <app-admin-customers-table
              [customers]="adminDataService.customers()"
              (updateStatus)="handleUpdateCustomerStatus($event)"
              (deleteCustomer)="handleDeleteCustomer($event)"
            />
          }

          @case ('settings') {
            <section aria-label="Painel de Configurações" class="space-y-4">
              <div class="bg-white border border-neutral-200 rounded-xl p-6 shadow-2xs space-y-6">
                <div class="border-b border-neutral-100 pb-4">
                  <h2 class="text-lg font-bold text-neutral-900">Configurações do Ambiente Mock</h2>
                  <p class="text-xs text-neutral-500 mt-0.5">
                    Informações operacionais do protótipo em memória.
                  </p>
                </div>

                <div class="space-y-3 text-xs">
                  <div class="p-3 bg-[#f5f5f7] rounded-lg border border-neutral-200/80 flex items-center justify-between">
                    <div>
                      <span class="font-bold text-neutral-900 block">Arquitetura de Estado</span>
                      <span class="text-neutral-500 block">Angular 21 Signals (In-Memory Reactivity)</span>
                    </div>
                    <span class="font-mono text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded font-bold">
                      Ativo
                    </span>
                  </div>

                  <div class="p-3 bg-[#f5f5f7] rounded-lg border border-neutral-200/80 flex items-center justify-between">
                    <div>
                      <span class="font-bold text-neutral-900 block">Estratégia de Renderização</span>
                      <span class="text-neutral-500 block">ChangeDetectionStrategy.OnPush em todos os nós</span>
                    </div>
                    <span class="font-mono text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded font-bold">
                      Otimizado
                    </span>
                  </div>
                </div>
              </div>
            </section>
          }
        }
      </main>

      <app-admin-product-modal
        [isOpen]="isProductModalOpen()"
        [product]="selectedProductForEdit()"
        [availableBrands]="productService.brands()"
        [availableCategories]="productService.categories()"
        (save)="handleSaveProduct($event)"
        (cancel)="handleCancelProductModal()"
      />
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '(document:keydown.escape)': 'closeMobileSidebar()'
  }
})
export class AdminComponent {
  readonly productService = inject(ProductService);
  readonly authService = inject(AuthService);
  readonly adminDataService = inject(AdminDataService);

  readonly tab = input<string | undefined>(undefined);

  readonly activeTab = signal<AdminTab>('products');
  readonly isMobileSidebarOpen = signal<boolean>(false);
  readonly isProductModalOpen = signal<boolean>(false);
  readonly selectedProductForEdit = signal<Product | null>(null);

  readonly currentSectionTitle = computed<string>(() => {
    switch (this.activeTab()) {
      case 'products':
        return 'Gerenciamento de Produtos';
      case 'orders':
        return 'Pedidos & Cotações';
      case 'customers':
        return 'Clientes Cadastrados';
      case 'settings':
        return 'Configurações do Sistema';
    }
  });

  readonly currentSectionDescription = computed<string>(() => {
    switch (this.activeTab()) {
      case 'products':
        return 'Controle em tempo real de máquinas industriais, estoque e especificações técnicas.';
      case 'orders':
        return 'Histórico de pedidos gerados, cotações corporativas e status de faturamento.';
      case 'customers':
        return 'Base unificada de confecções, indústrias têxteis e ateliês parceiros.';
      case 'settings':
        return 'Parâmetros operacionais e status do ambiente interativo.';
    }
  });

  constructor() {
    effect(() => {
      const tabParam = this.tab()?.toLowerCase();
      if (
        tabParam === 'products' ||
        tabParam === 'orders' ||
        tabParam === 'customers' ||
        tabParam === 'settings'
      ) {
        this.activeTab.set(tabParam);
      }
    });
  }

  selectTab(tab: AdminTab): void {
    this.activeTab.set(tab);
    this.isMobileSidebarOpen.set(false);
  }

  toggleMobileSidebar(): void {
    this.isMobileSidebarOpen.update((open) => !open);
  }

  closeMobileSidebar(): void {
    this.isMobileSidebarOpen.set(false);
  }

  handleEditProduct(product: Product): void {
    this.selectedProductForEdit.set(product);
    this.isProductModalOpen.set(true);
  }

  handleDeleteProduct(productId: string): void {
    this.productService.deleteProduct(productId);
  }

  handleCreateProduct(): void {
    this.selectedProductForEdit.set(null);
    this.isProductModalOpen.set(true);
  }

  handleSaveProduct(product: Product): void {
    const existing = this.selectedProductForEdit();
    if (existing) {
      this.productService.updateProduct(existing.id, product);
    } else {
      this.productService.addProduct(product);
    }
    this.isProductModalOpen.set(false);
    this.selectedProductForEdit.set(null);
  }

  handleCancelProductModal(): void {
    this.isProductModalOpen.set(false);
    this.selectedProductForEdit.set(null);
  }

  handleUpdateOrderStatus(payload: { id: string; status: OrderStatus }): void {
    this.adminDataService.updateOrderStatus(payload.id, payload.status);
  }

  handleDeleteOrder(orderId: string): void {
    this.adminDataService.deleteOrder(orderId);
  }

  handleUpdateCustomerStatus(payload: { id: string; status: CustomerStatus }): void {
    this.adminDataService.updateCustomerStatus(payload.id, payload.status);
  }

  handleDeleteCustomer(customerId: string): void {
    this.adminDataService.deleteCustomer(customerId);
  }
}

