import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  output,
  signal
} from '@angular/core';
import { Order, OrderStatus } from '../../../../core/models/order.model';

export type OrderSortColumn = 'quoteNumber' | 'clientName' | 'totalValue' | 'createdAt' | 'status';
export type OrderSortDirection = 'asc' | 'desc';

@Component({
  selector: 'app-admin-orders-table',
  template: `
    <section class="space-y-4" aria-label="Tabela de Cotações e Pedidos">
      <div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div class="p-4 bg-white rounded-xl border border-neutral-200 shadow-2xs">
          <span class="text-xs text-neutral-500 font-medium block">Total de Cotações</span>
          <div class="flex items-baseline justify-between mt-1">
            <span class="text-2xl font-black text-neutral-900 font-mono">{{ orders().length }}</span>
            <span class="text-xs font-mono text-neutral-500">histórico</span>
          </div>
        </div>

        <div class="p-4 bg-white rounded-xl border border-neutral-200 shadow-2xs">
          <span class="text-xs text-neutral-500 font-medium block">Cotações Pendentes</span>
          <div class="flex items-baseline justify-between mt-1">
            <span class="text-2xl font-black text-amber-700 font-mono">{{ pendingCount() }}</span>
            <span class="text-xs font-bold text-amber-800 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">Requer Ação</span>
          </div>
        </div>

        <div class="p-4 bg-white rounded-xl border border-neutral-200 shadow-2xs">
          <span class="text-xs text-neutral-500 font-medium block">Volume B2B em Cotações</span>
          <div class="flex items-baseline justify-between mt-1">
            <span class="text-2xl font-black text-[#0573cc] font-mono">{{ formatCurrency(totalVolume()) }}</span>
            <span class="text-xs font-mono text-neutral-500">ativo</span>
          </div>
        </div>
      </div>

      <div class="bg-white border border-neutral-200 rounded-xl shadow-2xs overflow-hidden">
        <div class="p-4 sm:p-5 border-b border-neutral-200 bg-white flex flex-col gap-4">
          <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 class="text-lg font-bold text-neutral-900 leading-tight">Cotações & Pedidos B2B</h2>
              <p class="text-xs text-neutral-500 mt-0.5">
                Acompanhe o funil de orçamentos e faturamento das confecções.
              </p>
            </div>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-1">
            <div class="relative sm:col-span-2">
              <label for="order-search-input" class="sr-only">Buscar cotação</label>
              <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-neutral-400">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-4 h-4" aria-hidden="true"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
              </div>
              <input
                id="order-search-input"
                type="search"
                [value]="searchQuery()"
                (input)="handleSearchInput($event)"
                placeholder="Buscar por número da cotação, cliente ou CNPJ..."
                class="w-full pl-9 pr-8 py-2 text-xs bg-[#f5f5f7] border border-neutral-200 rounded-lg text-neutral-900 placeholder-neutral-400 focus:outline-none focus:border-[#077fbd] focus:bg-white transition-all"
              />
              @if (searchQuery()) {
                <button
                  type="button"
                  (click)="clearSearch()"
                  class="absolute inset-y-0 right-0 pr-2.5 flex items-center text-neutral-400 hover:text-neutral-700 cursor-pointer"
                  aria-label="Limpar busca de cotações"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-3.5 h-3.5"><line x1="18" x2="6" y1="6" y2="18"/><line x1="6" x2="18" y1="6" y2="18"/></svg>
                </button>
              }
            </div>

            <div>
              <label for="order-status-filter" class="sr-only">Filtrar por status</label>
              <select
                id="order-status-filter"
                [value]="selectedStatus()"
                (change)="handleStatusChange($event)"
                class="w-full py-2 px-3 text-xs bg-[#f5f5f7] border border-neutral-200 rounded-lg text-neutral-800 focus:outline-none focus:border-[#077fbd] focus:bg-white transition-all cursor-pointer"
              >
                <option value="all">Todos os Status ({{ orders().length }})</option>
                <option value="pending">Pendentes</option>
                <option value="in_negotiation">Em Negociação</option>
                <option value="approved">Aprovadas</option>
                <option value="cancelled">Canceladas</option>
              </select>
            </div>
          </div>
        </div>

        <div class="overflow-x-auto">
          <table class="w-full text-left text-xs border-collapse" aria-label="Lista de Cotações e Pedidos">
            <thead>
              <tr class="bg-[#f5f5f7] text-neutral-600 border-b border-neutral-200 font-bold uppercase tracking-wider text-[11px] select-none">
                <th scope="col" class="py-3 px-3.5" [attr.aria-sort]="getAriaSort('quoteNumber')">
                  <button
                    type="button"
                    (click)="toggleSort('quoteNumber')"
                    class="inline-flex items-center gap-1.5 hover:text-neutral-900 transition-colors cursor-pointer font-bold focus-visible:outline-none focus-visible:text-[#077fbd]"
                    aria-label="Ordenar por Número da Cotação"
                  >
                    <span>Cotação</span>
                    <span [class]="getSortIconClass('quoteNumber')">
                      @if (sortColumn() === 'quoteNumber' && sortDirection() === 'asc') { ▲ } @else if (sortColumn() === 'quoteNumber' && sortDirection() === 'desc') { ▼ } @else { ↕ }
                    </span>
                  </button>
                </th>
                <th scope="col" class="py-3 px-3.5" [attr.aria-sort]="getAriaSort('clientName')">
                  <button
                    type="button"
                    (click)="toggleSort('clientName')"
                    class="inline-flex items-center gap-1.5 hover:text-neutral-900 transition-colors cursor-pointer font-bold focus-visible:outline-none focus-visible:text-[#077fbd]"
                    aria-label="Ordenar por Cliente"
                  >
                    <span>Cliente / Empresa</span>
                    <span [class]="getSortIconClass('clientName')">
                      @if (sortColumn() === 'clientName' && sortDirection() === 'asc') { ▲ } @else if (sortColumn() === 'clientName' && sortDirection() === 'desc') { ▼ } @else { ↕ }
                    </span>
                  </button>
                </th>
                <th scope="col" class="py-3 px-3.5 hidden md:table-cell text-center">Itens</th>
                <th scope="col" class="py-3 px-3.5 text-right" [attr.aria-sort]="getAriaSort('totalValue')">
                  <button
                    type="button"
                    (click)="toggleSort('totalValue')"
                    class="inline-flex items-center gap-1.5 hover:text-neutral-900 transition-colors cursor-pointer font-bold focus-visible:outline-none focus-visible:text-[#077fbd] ml-auto"
                    aria-label="Ordenar por Valor Total"
                  >
                    <span>Valor Total</span>
                    <span [class]="getSortIconClass('totalValue')">
                      @if (sortColumn() === 'totalValue' && sortDirection() === 'asc') { ▲ } @else if (sortColumn() === 'totalValue' && sortDirection() === 'desc') { ▼ } @else { ↕ }
                    </span>
                  </button>
                </th>
                <th scope="col" class="py-3 px-3.5 hidden sm:table-cell" [attr.aria-sort]="getAriaSort('createdAt')">
                  <button
                    type="button"
                    (click)="toggleSort('createdAt')"
                    class="inline-flex items-center gap-1.5 hover:text-neutral-900 transition-colors cursor-pointer font-bold focus-visible:outline-none focus-visible:text-[#077fbd]"
                    aria-label="Ordenar por Data"
                  >
                    <span>Data</span>
                    <span [class]="getSortIconClass('createdAt')">
                      @if (sortColumn() === 'createdAt' && sortDirection() === 'asc') { ▲ } @else if (sortColumn() === 'createdAt' && sortDirection() === 'desc') { ▼ } @else { ↕ }
                    </span>
                  </button>
                </th>
                <th scope="col" class="py-3 px-3.5 text-center" [attr.aria-sort]="getAriaSort('status')">
                  <button
                    type="button"
                    (click)="toggleSort('status')"
                    class="inline-flex items-center gap-1.5 hover:text-neutral-900 transition-colors cursor-pointer font-bold focus-visible:outline-none focus-visible:text-[#077fbd] mx-auto"
                    aria-label="Ordenar por Status"
                  >
                    <span>Status</span>
                    <span [class]="getSortIconClass('status')">
                      @if (sortColumn() === 'status' && sortDirection() === 'asc') { ▲ } @else if (sortColumn() === 'status' && sortDirection() === 'desc') { ▼ } @else { ↕ }
                    </span>
                  </button>
                </th>
                <th scope="col" class="py-3 px-3.5 text-right w-36">Ações</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-neutral-200">
              @for (order of paginatedOrders(); track order.id) {
                <tr class="hover:bg-neutral-50/80 transition-colors">
                  <td class="py-3 px-3.5 font-mono font-bold text-neutral-900 whitespace-nowrap">
                    {{ order.quoteNumber }}
                  </td>
                  <td class="py-3 px-3.5">
                    <div>
                      <span class="font-bold text-neutral-900 block leading-tight">{{ order.clientName }}</span>
                      <span class="text-[11px] text-neutral-500 font-mono block leading-tight">{{ order.cnpjCpf }}</span>
                    </div>
                  </td>
                  <td class="py-3 px-3.5 hidden md:table-cell text-center font-mono font-medium text-neutral-700">
                    <span class="px-2 py-0.5 rounded bg-neutral-100 border border-neutral-200 text-[11px]">
                      {{ order.itemsCount }} {{ order.itemsCount === 1 ? 'item' : 'itens' }}
                    </span>
                  </td>
                  <td class="py-3 px-3.5 text-right font-mono font-bold text-neutral-900 whitespace-nowrap">
                    {{ formatCurrency(order.totalValue) }}
                  </td>
                  <td class="py-3 px-3.5 hidden sm:table-cell text-neutral-600 font-mono whitespace-nowrap">
                    {{ order.createdAt }}
                  </td>
                  <td class="py-3 px-3.5 text-center whitespace-nowrap">
                    <span [class]="getStatusBadgeClass(order.status)">
                      {{ getStatusLabel(order.status) }}
                    </span>
                  </td>
                  <td class="py-3 px-3.5 text-right whitespace-nowrap">
                    <div class="inline-flex items-center gap-1">
                      <button
                        type="button"
                        (click)="viewDetails(order)"
                        class="p-1.5 text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100 rounded-md transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#077fbd]"
                        [attr.aria-label]="'Ver detalhes da cotação ' + order.quoteNumber"
                        title="Ver Detalhes"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-3.5 h-3.5"><circle cx="12" cy="12" r="10"/><line x1="12" x2="12" y1="16" y2="12"/><line x1="12" x2="12.01" y1="8" y2="8"/></svg>
                      </button>

                      <button
                        type="button"
                        (click)="cycleStatus(order)"
                        class="p-1.5 text-[#0573cc] hover:text-[#077fbd] hover:bg-blue-50 rounded-md transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#077fbd]"
                        [attr.aria-label]="'Avançar status da cotação ' + order.quoteNumber"
                        title="Avançar Status"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-3.5 h-3.5"><polyline points="9 18 15 12 9 6"/></svg>
                      </button>

                      <button
                        type="button"
                        (click)="deleteOrder.emit(order.id)"
                        class="p-1.5 text-neutral-400 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500"
                        [attr.aria-label]="'Excluir cotação ' + order.quoteNumber"
                        title="Excluir Cotação"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-3.5 h-3.5"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
                      </button>
                    </div>
                  </td>
                </tr>
              } @empty {
                <tr>
                  <td colspan="7" class="py-10 px-4 text-center text-neutral-500">
                    <p class="text-sm font-semibold text-neutral-800">Nenhuma cotação encontrada</p>
                    <p class="text-xs mt-0.5">Ajuste seus termos de busca ou filtros aplicados.</p>
                  </td>
                </tr>
              }
            </tbody>
          </table>
        </div>

        <div class="p-3.5 sm:p-4 border-t border-neutral-200 bg-[#f5f5f7] flex items-center justify-between text-xs">
          <span class="text-neutral-600 font-mono">
            {{ filteredOrders().length }} registros
          </span>

          @if (totalPages() > 1) {
            <nav aria-label="Paginação de Cotações" class="inline-flex items-center gap-1">
              <button
                type="button"
                (click)="goToPage(currentPage() - 1)"
                [disabled]="currentPage() === 1"
                class="px-2 py-1 rounded bg-white hover:bg-neutral-100 disabled:opacity-40 border border-neutral-200 font-medium cursor-pointer"
              >
                Anterior
              </button>
              <span class="px-2 font-mono">{{ currentPage() }} / {{ totalPages() }}</span>
              <button
                type="button"
                (click)="goToPage(currentPage() + 1)"
                [disabled]="currentPage() === totalPages()"
                class="px-2 py-1 rounded bg-white hover:bg-neutral-100 disabled:opacity-40 border border-neutral-200 font-medium cursor-pointer"
              >
                Próxima
              </button>
            </nav>
          }
        </div>
      </div>

      @if (selectedOrderForDetails()) {
        <div
          class="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6"
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-order-details-title"
          (click)="closeDetails()"
        >
          <div
            class="bg-white rounded-2xl shadow-2xl border border-neutral-200 w-full max-w-xl overflow-hidden flex flex-col max-h-[90vh]"
            (click)="$event.stopPropagation()"
          >
            <header class="p-5 bg-[#101010] text-white flex items-center justify-between border-b border-neutral-800 shrink-0">
              <div>
                <span class="text-[10px] uppercase font-mono text-[#0573cc] font-bold block">Detalhes da Cotação</span>
                <h3 id="modal-order-details-title" class="text-lg font-black text-white leading-tight">
                  {{ selectedOrderForDetails()?.quoteNumber }} — {{ selectedOrderForDetails()?.clientName }}
                </h3>
              </div>
              <button
                type="button"
                (click)="closeDetails()"
                class="p-1.5 text-neutral-400 hover:text-white rounded-md hover:bg-neutral-800 cursor-pointer"
                aria-label="Fechar detalhes da cotação"
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-5 h-5"><line x1="18" x2="6" y1="6" y2="18"/><line x1="6" x2="18" y1="6" y2="18"/></svg>
              </button>
            </header>

            <div class="p-5 overflow-y-auto space-y-4 text-xs">
              <div class="grid grid-cols-2 gap-3 p-3 bg-[#f5f5f7] rounded-lg border border-neutral-200">
                <div>
                  <span class="text-neutral-500 block">Condição de Pagamento:</span>
                  <span class="font-bold text-neutral-900 block">{{ selectedOrderForDetails()?.paymentTerms }}</span>
                </div>
                <div>
                  <span class="text-neutral-500 block">Telefone / WhatsApp:</span>
                  <span class="font-bold text-neutral-900 block font-mono">{{ selectedOrderForDetails()?.phone }}</span>
                </div>
              </div>

              @if (selectedOrderForDetails()?.notes) {
                <div class="p-3 bg-blue-50 border border-blue-200 rounded-lg text-blue-900">
                  <span class="font-bold block">Observações do Cliente:</span>
                  <span class="block mt-0.5">{{ selectedOrderForDetails()?.notes }}</span>
                </div>
              }

              <div>
                <span class="font-bold text-neutral-900 block mb-2 uppercase tracking-wider text-[11px]">Itens Cotados</span>
                <div class="border border-neutral-200 rounded-lg overflow-hidden">
                  <table class="w-full text-left text-xs">
                    <thead class="bg-neutral-100 font-bold text-neutral-700">
                      <tr>
                        <th class="p-2">Item</th>
                        <th class="p-2 text-center">Qtd</th>
                        <th class="p-2 text-right">Unitário</th>
                        <th class="p-2 text-right">Subtotal</th>
                      </tr>
                    </thead>
                    <tbody class="divide-y divide-neutral-200 font-mono">
                      @for (item of selectedOrderForDetails()?.items; track item.sku) {
                        <tr>
                          <td class="p-2 font-sans font-medium text-neutral-900">{{ item.productName }}</td>
                          <td class="p-2 text-center">{{ item.quantity }}</td>
                          <td class="p-2 text-right">{{ formatCurrency(item.unitPrice) }}</td>
                          <td class="p-2 text-right font-bold text-neutral-900">{{ formatCurrency(item.unitPrice * item.quantity) }}</td>
                        </tr>
                      }
                    </tbody>
                  </table>
                </div>
              </div>

              <div class="pt-2 border-t border-neutral-200 flex justify-between items-center text-sm">
                <span class="font-bold text-neutral-900">Valor Total da Proposta:</span>
                <span class="text-lg font-black text-[#0573cc] font-mono">{{ formatCurrency(selectedOrderForDetails()?.totalValue || 0) }}</span>
              </div>
            </div>

            <footer class="p-4 bg-neutral-50 border-t border-neutral-200 flex justify-end">
              <button
                type="button"
                (click)="closeDetails()"
                class="px-4 py-2 text-xs font-bold rounded-lg bg-neutral-900 text-white hover:bg-neutral-800 cursor-pointer"
              >
                Fechar
              </button>
            </footer>
          </div>
        </div>
      }
    </section>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '(document:keydown.escape)': 'onEscape()'
  }
})
export class AdminOrdersTableComponent {
  readonly orders = input<Order[]>([]);

  readonly updateStatus = output<{ id: string; status: OrderStatus }>();
  readonly deleteOrder = output<string>();

  readonly searchQuery = signal<string>('');
  readonly selectedStatus = signal<string>('all');
  readonly sortColumn = signal<OrderSortColumn>('createdAt');
  readonly sortDirection = signal<OrderSortDirection>('desc');
  readonly currentPage = signal<number>(1);
  readonly itemsPerPage = signal<number>(5);
  readonly selectedOrderForDetails = signal<Order | null>(null);

  readonly pendingCount = computed<number>(() => {
    return this.orders().filter((o) => o.status === 'pending').length;
  });

  readonly totalVolume = computed<number>(() => {
    return this.orders()
      .filter((o) => o.status !== 'cancelled')
      .reduce((acc, curr) => acc + curr.totalValue, 0);
  });

  readonly filteredOrders = computed<Order[]>(() => {
    const query = this.searchQuery().toLowerCase().trim();
    const st = this.selectedStatus();
    const col = this.sortColumn();
    const dir = this.sortDirection();

    let result = this.orders().filter((order) => {
      const matchesQuery =
        !query ||
        order.quoteNumber.toLowerCase().includes(query) ||
        order.clientName.toLowerCase().includes(query) ||
        order.cnpjCpf.toLowerCase().includes(query) ||
        order.email.toLowerCase().includes(query);

      const matchesStatus = st === 'all' || order.status === st;
      return matchesQuery && matchesStatus;
    });

    result = [...result].sort((a, b) => {
      let comparison = 0;
      switch (col) {
        case 'quoteNumber':
          comparison = a.quoteNumber.localeCompare(b.quoteNumber);
          break;
        case 'clientName':
          comparison = a.clientName.localeCompare(b.clientName);
          break;
        case 'totalValue':
          comparison = a.totalValue - b.totalValue;
          break;
        case 'createdAt':
          comparison = a.createdAt.localeCompare(b.createdAt);
          break;
        case 'status':
          comparison = a.status.localeCompare(b.status);
          break;
      }
      return dir === 'asc' ? comparison : -comparison;
    });

    return result;
  });

  readonly totalPages = computed<number>(() => {
    return Math.ceil(this.filteredOrders().length / this.itemsPerPage()) || 1;
  });

  readonly paginatedOrders = computed<Order[]>(() => {
    const start = (this.currentPage() - 1) * this.itemsPerPage();
    return this.filteredOrders().slice(start, start + this.itemsPerPage());
  });

  formatCurrency(val: number): string {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val);
  }

  handleSearchInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.searchQuery.set(input.value);
    this.currentPage.set(1);
  }

  clearSearch(): void {
    this.searchQuery.set('');
    this.currentPage.set(1);
  }

  handleStatusChange(event: Event): void {
    const select = event.target as HTMLSelectElement;
    this.selectedStatus.set(select.value);
    this.currentPage.set(1);
  }

  toggleSort(column: OrderSortColumn): void {
    if (this.sortColumn() === column) {
      this.sortDirection.update((d) => (d === 'asc' ? 'desc' : 'asc'));
    } else {
      this.sortColumn.set(column);
      this.sortDirection.set('asc');
    }
  }

  getAriaSort(column: OrderSortColumn): 'ascending' | 'descending' | 'none' {
    if (this.sortColumn() !== column) return 'none';
    return this.sortDirection() === 'asc' ? 'ascending' : 'descending';
  }

  getSortIconClass(column: OrderSortColumn): string {
    if (this.sortColumn() === column) return 'text-[#077fbd] font-bold text-[10px]';
    return 'text-neutral-400 text-[10px]';
  }

  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages()) {
      this.currentPage.set(page);
    }
  }

  getStatusBadgeClass(status: OrderStatus): string {
    const base = 'inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold';
    switch (status) {
      case 'pending':
        return `${base} bg-amber-50 text-amber-800 border border-amber-200`;
      case 'in_negotiation':
        return `${base} bg-blue-50 text-blue-800 border border-blue-200`;
      case 'approved':
        return `${base} bg-emerald-50 text-emerald-800 border border-emerald-200`;
      case 'cancelled':
        return `${base} bg-neutral-100 text-neutral-600 border border-neutral-200`;
    }
  }

  getStatusLabel(status: OrderStatus): string {
    switch (status) {
      case 'pending':
        return 'Pendente';
      case 'in_negotiation':
        return 'Em Negociação';
      case 'approved':
        return 'Aprovada';
      case 'cancelled':
        return 'Cancelada';
    }
  }

  cycleStatus(order: Order): void {
    const sequence: Record<OrderStatus, OrderStatus> = {
      pending: 'in_negotiation',
      in_negotiation: 'approved',
      approved: 'cancelled',
      cancelled: 'pending'
    };
    this.updateStatus.emit({ id: order.id, status: sequence[order.status] });
  }

  viewDetails(order: Order): void {
    this.selectedOrderForDetails.set(order);
  }

  closeDetails(): void {
    this.selectedOrderForDetails.set(null);
  }

  protected onEscape(): void {
    if (this.selectedOrderForDetails()) {
      this.closeDetails();
    }
  }
}
