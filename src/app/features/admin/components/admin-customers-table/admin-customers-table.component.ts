import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  output,
  signal
} from '@angular/core';
import { Customer, CustomerStatus } from '../../../../core/models/customer.model';

export type CustomerSortColumn = 'tradeName' | 'cnpjCpf' | 'cityState' | 'totalSpent' | 'status';
export type CustomerSortDirection = 'asc' | 'desc';

@Component({
  selector: 'app-admin-customers-table',
  template: `
    <section class="space-y-4" aria-label="Tabela de Clientes B2B">
      <div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div class="p-4 bg-white rounded-xl border border-neutral-200 shadow-2xs">
          <span class="text-xs text-neutral-500 font-medium block">Total de Contas B2B</span>
          <div class="flex items-baseline justify-between mt-1">
            <span class="text-2xl font-black text-neutral-900 font-mono">{{ customers().length }}</span>
            <span class="text-xs font-mono text-neutral-500">cadastros</span>
          </div>
        </div>

        <div class="p-4 bg-white rounded-xl border border-neutral-200 shadow-2xs">
          <span class="text-xs text-neutral-500 font-medium block">Contas Ativas</span>
          <div class="flex items-baseline justify-between mt-1">
            <span class="text-2xl font-black text-emerald-700 font-mono">{{ activeCount() }}</span>
            <span class="text-xs font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">Operando</span>
          </div>
        </div>

        <div class="p-4 bg-white rounded-xl border border-neutral-200 shadow-2xs">
          <span class="text-xs text-neutral-500 font-medium block">Volume Histórico Comprado</span>
          <div class="flex items-baseline justify-between mt-1">
            <span class="text-2xl font-black text-[#0573cc] font-mono">{{ formatCurrency(totalSpentVolume()) }}</span>
            <span class="text-xs font-mono text-neutral-500">total acumulado</span>
          </div>
        </div>
      </div>

      <div class="bg-white border border-neutral-200 rounded-xl shadow-2xs overflow-hidden">
        <div class="p-4 sm:p-5 border-b border-neutral-200 bg-white flex flex-col gap-4">
          <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 class="text-lg font-bold text-neutral-900 leading-tight">Base de Clientes & Confecções</h2>
              <p class="text-xs text-neutral-500 mt-0.5">
                Empresas, indústrias e ateliês com cadastro corporativo no portal SKYTEC.
              </p>
            </div>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-1">
            <div class="relative sm:col-span-2">
              <label for="customer-search-input" class="sr-only">Buscar cliente</label>
              <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-neutral-400">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-4 h-4" aria-hidden="true"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
              </div>
              <input
                id="customer-search-input"
                type="search"
                [value]="searchQuery()"
                (input)="handleSearchInput($event)"
                placeholder="Buscar por razão social, nome fantasia, CNPJ, cidade..."
                class="w-full pl-9 pr-8 py-2 text-xs bg-[#f5f5f7] border border-neutral-200 rounded-lg text-neutral-900 placeholder-neutral-400 focus:outline-none focus:border-[#077fbd] focus:bg-white transition-all"
              />
              @if (searchQuery()) {
                <button
                  type="button"
                  (click)="clearSearch()"
                  class="absolute inset-y-0 right-0 pr-2.5 flex items-center text-neutral-400 hover:text-neutral-700 cursor-pointer"
                  aria-label="Limpar busca de clientes"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-3.5 h-3.5"><line x1="18" x2="6" y1="6" y2="18"/><line x1="6" x2="18" y1="6" y2="18"/></svg>
                </button>
              }
            </div>

            <div>
              <label for="customer-status-filter" class="sr-only">Filtrar por status</label>
              <select
                id="customer-status-filter"
                [value]="selectedStatus()"
                (change)="handleStatusChange($event)"
                class="w-full py-2 px-3 text-xs bg-[#f5f5f7] border border-neutral-200 rounded-lg text-neutral-800 focus:outline-none focus:border-[#077fbd] focus:bg-white transition-all cursor-pointer"
              >
                <option value="all">Todos os Status ({{ customers().length }})</option>
                <option value="active">Ativos</option>
                <option value="pending">Pendentes</option>
                <option value="inactive">Inativos</option>
              </select>
            </div>
          </div>
        </div>

        <div class="overflow-x-auto">
          <table class="w-full text-left text-xs border-collapse" aria-label="Lista de Clientes B2B">
            <thead>
              <tr class="bg-[#f5f5f7] text-neutral-600 border-b border-neutral-200 font-bold uppercase tracking-wider text-[11px] select-none">
                <th scope="col" class="py-3 px-3.5" [attr.aria-sort]="getAriaSort('tradeName')">
                  <button
                    type="button"
                    (click)="toggleSort('tradeName')"
                    class="inline-flex items-center gap-1.5 hover:text-neutral-900 transition-colors cursor-pointer font-bold focus-visible:outline-none focus-visible:text-[#077fbd]"
                    aria-label="Ordenar por Empresa"
                  >
                    <span>Empresa / Razão Social</span>
                    <span [class]="getSortIconClass('tradeName')">
                      @if (sortColumn() === 'tradeName' && sortDirection() === 'asc') { ▲ } @else if (sortColumn() === 'tradeName' && sortDirection() === 'desc') { ▼ } @else { ↕ }
                    </span>
                  </button>
                </th>
                <th scope="col" class="py-3 px-3.5" [attr.aria-sort]="getAriaSort('cnpjCpf')">
                  <button
                    type="button"
                    (click)="toggleSort('cnpjCpf')"
                    class="inline-flex items-center gap-1.5 hover:text-neutral-900 transition-colors cursor-pointer font-bold focus-visible:outline-none focus-visible:text-[#077fbd]"
                    aria-label="Ordenar por CNPJ"
                  >
                    <span>CNPJ / CPF</span>
                    <span [class]="getSortIconClass('cnpjCpf')">
                      @if (sortColumn() === 'cnpjCpf' && sortDirection() === 'asc') { ▲ } @else if (sortColumn() === 'cnpjCpf' && sortDirection() === 'desc') { ▼ } @else { ↕ }
                    </span>
                  </button>
                </th>
                <th scope="col" class="py-3 px-3.5 hidden md:table-cell">Contato & E-mail</th>
                <th scope="col" class="py-3 px-3.5 hidden sm:table-cell" [attr.aria-sort]="getAriaSort('cityState')">
                  <button
                    type="button"
                    (click)="toggleSort('cityState')"
                    class="inline-flex items-center gap-1.5 hover:text-neutral-900 transition-colors cursor-pointer font-bold focus-visible:outline-none focus-visible:text-[#077fbd]"
                    aria-label="Ordenar por Localização"
                  >
                    <span>Cidade / UF</span>
                    <span [class]="getSortIconClass('cityState')">
                      @if (sortColumn() === 'cityState' && sortDirection() === 'asc') { ▲ } @else if (sortColumn() === 'cityState' && sortDirection() === 'desc') { ▼ } @else { ↕ }
                    </span>
                  </button>
                </th>
                <th scope="col" class="py-3 px-3.5 text-right" [attr.aria-sort]="getAriaSort('totalSpent')">
                  <button
                    type="button"
                    (click)="toggleSort('totalSpent')"
                    class="inline-flex items-center gap-1.5 hover:text-neutral-900 transition-colors cursor-pointer font-bold focus-visible:outline-none focus-visible:text-[#077fbd] ml-auto"
                    aria-label="Ordenar por Volume B2B"
                  >
                    <span>Volume B2B</span>
                    <span [class]="getSortIconClass('totalSpent')">
                      @if (sortColumn() === 'totalSpent' && sortDirection() === 'asc') { ▲ } @else if (sortColumn() === 'totalSpent' && sortDirection() === 'desc') { ▼ } @else { ↕ }
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
              @for (customer of paginatedCustomers(); track customer.id) {
                <tr class="hover:bg-neutral-50/80 transition-colors">
                  <td class="py-3 px-3.5">
                    <div>
                      <span class="font-bold text-neutral-900 block leading-tight">{{ customer.tradeName }}</span>
                      <span class="text-[11px] text-neutral-500 block leading-tight truncate max-w-xs">{{ customer.companyName }}</span>
                    </div>
                  </td>
                  <td class="py-3 px-3.5 font-mono text-[11px] font-bold text-neutral-700 whitespace-nowrap">
                    {{ customer.cnpjCpf }}
                  </td>
                  <td class="py-3 px-3.5 hidden md:table-cell">
                    <div>
                      <span class="font-medium text-neutral-900 block leading-tight">{{ customer.contactName }}</span>
                      <span class="text-[11px] text-neutral-500 font-mono block leading-tight">{{ customer.email }}</span>
                    </div>
                  </td>
                  <td class="py-3 px-3.5 hidden sm:table-cell text-neutral-700 whitespace-nowrap">
                    <div>
                      <span class="block font-medium">{{ customer.cityState }}</span>
                      <span class="text-[10px] text-neutral-500 block">{{ customer.segment }}</span>
                    </div>
                  </td>
                  <td class="py-3 px-3.5 text-right font-mono font-bold text-neutral-900 whitespace-nowrap">
                    {{ formatCurrency(customer.totalSpent) }}
                  </td>
                  <td class="py-3 px-3.5 text-center whitespace-nowrap">
                    <span [class]="getStatusBadgeClass(customer.status)">
                      {{ getStatusLabel(customer.status) }}
                    </span>
                  </td>
                  <td class="py-3 px-3.5 text-right whitespace-nowrap">
                    <div class="inline-flex items-center gap-1">
                      <button
                        type="button"
                        (click)="toggleStatus(customer)"
                        class="p-1.5 text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100 rounded-md transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#077fbd]"
                        [attr.aria-label]="customer.status === 'active' ? 'Desativar conta' : 'Ativar conta'"
                        [title]="customer.status === 'active' ? 'Desativar Conta' : 'Ativar Conta'"
                      >
                        @if (customer.status === 'active') {
                          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-3.5 h-3.5 text-emerald-600"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
                        } @else {
                          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-3.5 h-3.5 text-neutral-400"><circle cx="12" cy="12" r="10"/><line x1="12" x2="12" y1="8" y2="12"/><line x1="12" x2="12.01" y1="16" y2="16"/></svg>
                        }
                      </button>

                      <a
                        [href]="'mailto:' + customer.email"
                        class="p-1.5 text-neutral-600 hover:text-[#0573cc] hover:bg-neutral-100 rounded-md transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#077fbd]"
                        [attr.aria-label]="'Enviar e-mail para ' + customer.contactName"
                        title="Enviar E-mail"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-3.5 h-3.5"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>
                      </a>

                      <button
                        type="button"
                        (click)="deleteCustomer.emit(customer.id)"
                        class="p-1.5 text-neutral-400 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500"
                        [attr.aria-label]="'Excluir cliente ' + customer.tradeName"
                        title="Excluir Cadastro"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-3.5 h-3.5"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
                      </button>
                    </div>
                  </td>
                </tr>
              } @empty {
                <tr>
                  <td colspan="7" class="py-10 px-4 text-center text-neutral-500">
                    <p class="text-sm font-semibold text-neutral-800">Nenhum cliente encontrado</p>
                    <p class="text-xs mt-0.5">Ajuste seus termos de busca ou filtros aplicados.</p>
                  </td>
                </tr>
              }
            </tbody>
          </table>
        </div>

        <div class="p-3.5 sm:p-4 border-t border-neutral-200 bg-[#f5f5f7] flex items-center justify-between text-xs">
          <span class="text-neutral-600 font-mono">
            {{ filteredCustomers().length }} registros
          </span>

          @if (totalPages() > 1) {
            <nav aria-label="Paginação de Clientes" class="inline-flex items-center gap-1">
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
    </section>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AdminCustomersTableComponent {
  readonly customers = input<Customer[]>([]);

  readonly updateStatus = output<{ id: string; status: CustomerStatus }>();
  readonly deleteCustomer = output<string>();

  readonly searchQuery = signal<string>('');
  readonly selectedStatus = signal<string>('all');
  readonly sortColumn = signal<CustomerSortColumn>('tradeName');
  readonly sortDirection = signal<CustomerSortDirection>('asc');
  readonly currentPage = signal<number>(1);
  readonly itemsPerPage = signal<number>(5);

  readonly activeCount = computed<number>(() => {
    return this.customers().filter((c) => c.status === 'active').length;
  });

  readonly totalSpentVolume = computed<number>(() => {
    return this.customers().reduce((acc, curr) => acc + curr.totalSpent, 0);
  });

  readonly filteredCustomers = computed<Customer[]>(() => {
    const query = this.searchQuery().toLowerCase().trim();
    const st = this.selectedStatus();
    const col = this.sortColumn();
    const dir = this.sortDirection();

    let result = this.customers().filter((customer) => {
      const matchesQuery =
        !query ||
        customer.tradeName.toLowerCase().includes(query) ||
        customer.companyName.toLowerCase().includes(query) ||
        customer.cnpjCpf.toLowerCase().includes(query) ||
        customer.contactName.toLowerCase().includes(query) ||
        customer.cityState.toLowerCase().includes(query) ||
        customer.segment.toLowerCase().includes(query) ||
        customer.email.toLowerCase().includes(query);

      const matchesStatus = st === 'all' || customer.status === st;
      return matchesQuery && matchesStatus;
    });

    result = [...result].sort((a, b) => {
      let comparison = 0;
      switch (col) {
        case 'tradeName':
          comparison = a.tradeName.localeCompare(b.tradeName);
          break;
        case 'cnpjCpf':
          comparison = a.cnpjCpf.localeCompare(b.cnpjCpf);
          break;
        case 'cityState':
          comparison = a.cityState.localeCompare(b.cityState);
          break;
        case 'totalSpent':
          comparison = a.totalSpent - b.totalSpent;
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
    return Math.ceil(this.filteredCustomers().length / this.itemsPerPage()) || 1;
  });

  readonly paginatedCustomers = computed<Customer[]>(() => {
    const start = (this.currentPage() - 1) * this.itemsPerPage();
    return this.filteredCustomers().slice(start, start + this.itemsPerPage());
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

  toggleSort(column: CustomerSortColumn): void {
    if (this.sortColumn() === column) {
      this.sortDirection.update((d) => (d === 'asc' ? 'desc' : 'asc'));
    } else {
      this.sortColumn.set(column);
      this.sortDirection.set('asc');
    }
  }

  getAriaSort(column: CustomerSortColumn): 'ascending' | 'descending' | 'none' {
    if (this.sortColumn() !== column) return 'none';
    return this.sortDirection() === 'asc' ? 'ascending' : 'descending';
  }

  getSortIconClass(column: CustomerSortColumn): string {
    if (this.sortColumn() === column) return 'text-[#077fbd] font-bold text-[10px]';
    return 'text-neutral-400 text-[10px]';
  }

  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages()) {
      this.currentPage.set(page);
    }
  }

  getStatusBadgeClass(status: CustomerStatus): string {
    const base = 'inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold';
    switch (status) {
      case 'active':
        return `${base} bg-emerald-50 text-emerald-800 border border-emerald-200`;
      case 'pending':
        return `${base} bg-amber-50 text-amber-800 border border-amber-200`;
      case 'inactive':
        return `${base} bg-neutral-100 text-neutral-600 border border-neutral-200`;
    }
  }

  getStatusLabel(status: CustomerStatus): string {
    switch (status) {
      case 'active':
        return 'Ativo';
      case 'pending':
        return 'Pendente';
      case 'inactive':
        return 'Inativo';
    }
  }

  toggleStatus(customer: Customer): void {
    const newStatus: CustomerStatus = customer.status === 'active' ? 'inactive' : 'active';
    this.updateStatus.emit({ id: customer.id, status: newStatus });
  }
}
