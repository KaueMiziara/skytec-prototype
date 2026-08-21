import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AdminOrdersTableComponent } from './admin-orders-table.component';
import { Order, OrderStatus } from '../../../../core/models/order.model';

describe('AdminOrdersTableComponent', () => {
  let component: AdminOrdersTableComponent;
  let fixture: ComponentFixture<AdminOrdersTableComponent>;

  const mockOrders: Order[] = [
    {
      id: 'ord-1',
      quoteNumber: 'COT-001',
      clientName: 'Confecção Alfa',
      cnpjCpf: '11.222.333/0001-44',
      email: 'alfa@test.com',
      phone: '(11) 91111-1111',
      itemsCount: 2,
      totalValue: 9000,
      status: 'pending',
      createdAt: '20/08/2026',
      paymentTerms: 'Boleto 30 dias',
      notes: 'Nota de teste',
      items: [
        { sku: 'SKU-1', productName: 'Máquina Reta', quantity: 2, unitPrice: 4500 }
      ]
    },
    {
      id: 'ord-2',
      quoteNumber: 'COT-002',
      clientName: 'Confecção Beta',
      cnpjCpf: '22.333.444/0001-55',
      email: 'beta@test.com',
      phone: '(11) 92222-2222',
      itemsCount: 1,
      totalValue: 5500,
      status: 'approved',
      createdAt: '19/08/2026',
      paymentTerms: 'PIX',
      items: [
        { sku: 'SKU-2', productName: 'Overlock', quantity: 1, unitPrice: 5500 }
      ]
    }
  ];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminOrdersTableComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(AdminOrdersTableComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('orders', mockOrders);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render KPI metric cards with correct values', () => {
    const text = fixture.nativeElement.textContent;
    expect(text).toContain('Total de Cotações');
    expect(text).toContain('Cotações Pendentes');
    expect(text).toContain('Volume B2B em Cotações');
    expect(component.pendingCount()).toBe(1);
    expect(component.totalVolume()).toBe(14500);
  });

  it('should render orders in table rows', () => {
    const rows = fixture.nativeElement.querySelectorAll('tbody tr');
    expect(rows.length).toBe(2);

    const firstRowText = rows[0].textContent;
    expect(firstRowText).toContain('COT-001');
    expect(firstRowText).toContain('Confecção Alfa');
    expect(firstRowText).toContain('Pendente');
  });

  it('should filter orders by search query', () => {
    component.searchQuery.set('Beta');
    fixture.detectChanges();

    const rows = fixture.nativeElement.querySelectorAll('tbody tr');
    expect(rows.length).toBe(1);
    expect(rows[0].textContent).toContain('Confecção Beta');
  });

  it('should filter orders by status', () => {
    component.selectedStatus.set('approved');
    fixture.detectChanges();

    const rows = fixture.nativeElement.querySelectorAll('tbody tr');
    expect(rows.length).toBe(1);
    expect(rows[0].textContent).toContain('COT-002');
  });

  it('should sort orders by totalValue', () => {
    component.toggleSort('totalValue');
    fixture.detectChanges();

    expect(component.sortColumn()).toBe('totalValue');
    expect(component.sortDirection()).toBe('asc');
    expect(component.filteredOrders()[0].totalValue).toBe(5500);

    component.toggleSort('totalValue');
    fixture.detectChanges();
    expect(component.sortDirection()).toBe('desc');
    expect(component.filteredOrders()[0].totalValue).toBe(9000);
  });

  it('should emit updateStatus event when cycle status action is clicked', () => {
    let payload: { id: string; status: OrderStatus } | undefined;
    component.updateStatus.subscribe((p) => (payload = p));

    const cycleBtn = fixture.nativeElement.querySelector('button[title="Avançar Status"]');
    expect(cycleBtn).toBeTruthy();
    cycleBtn.click();

    expect(payload).toBeDefined();
    expect(payload?.id).toBe('ord-1');
    expect(payload?.status).toBe('in_negotiation');
  });

  it('should emit deleteOrder event when delete button is clicked', () => {
    let deletedId: string | undefined;
    component.deleteOrder.subscribe((id) => (deletedId = id));

    const deleteBtn = fixture.nativeElement.querySelector('button[title="Excluir Cotação"]');
    expect(deleteBtn).toBeTruthy();
    deleteBtn.click();

    expect(deletedId).toBe('ord-1');
  });

  it('should open and close details modal dialog', () => {
    expect(component.selectedOrderForDetails()).toBeNull();

    const viewDetailsBtn = fixture.nativeElement.querySelector('button[title="Ver Detalhes"]');
    expect(viewDetailsBtn).toBeTruthy();
    viewDetailsBtn.click();
    fixture.detectChanges();

    expect(component.selectedOrderForDetails()?.id).toBe('ord-1');
    const dialog = fixture.nativeElement.querySelector('[role="dialog"]');
    expect(dialog).toBeTruthy();
    expect(dialog.textContent).toContain('COT-001 — Confecção Alfa');
    expect(dialog.textContent).toContain('Máquina Reta');

    component.closeDetails();
    fixture.detectChanges();
    expect(component.selectedOrderForDetails()).toBeNull();
  });

  it('should close details modal dialog on Escape key press', () => {
    component.selectedOrderForDetails.set(mockOrders[0]);
    fixture.detectChanges();

    expect(component.selectedOrderForDetails()).not.toBeNull();

    const event = new KeyboardEvent('keydown', { key: 'Escape' });
    document.dispatchEvent(event);
    fixture.detectChanges();

    expect(component.selectedOrderForDetails()).toBeNull();
  });
});
