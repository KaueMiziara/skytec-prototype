import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AdminCustomersTableComponent } from './admin-customers-table.component';
import { Customer, CustomerStatus } from '../../../../core/models/customer.model';

describe('AdminCustomersTableComponent', () => {
  let component: AdminCustomersTableComponent;
  let fixture: ComponentFixture<AdminCustomersTableComponent>;

  const mockCustomers: Customer[] = [
    {
      id: 'cust-1',
      companyName: 'Confecções Alfa Ltda',
      tradeName: 'Alfa Têxtil',
      cnpjCpf: '11.222.333/0001-44',
      contactName: 'João Silva',
      email: 'joao@alfa.com.br',
      phone: '(11) 91111-1111',
      cityState: 'São Paulo / SP',
      segment: 'Camisaria',
      ordersCount: 3,
      totalSpent: 35000,
      status: 'active',
      registeredAt: '10/01/2025'
    },
    {
      id: 'cust-2',
      companyName: 'Moda Beta ME',
      tradeName: 'Beta Moda',
      cnpjCpf: '22.333.444/0001-55',
      contactName: 'Maria Souza',
      email: 'maria@beta.com.br',
      phone: '(47) 92222-2222',
      cityState: 'Brusque / SC',
      segment: 'Moda Praia',
      ordersCount: 1,
      totalSpent: 12000,
      status: 'inactive',
      registeredAt: '15/03/2025'
    }
  ];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminCustomersTableComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(AdminCustomersTableComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('customers', mockCustomers);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render customer KPI metric cards with correct values', () => {
    const text = fixture.nativeElement.textContent;
    expect(text).toContain('Total de Contas B2B');
    expect(text).toContain('Contas Ativas');
    expect(text).toContain('Volume Histórico Comprado');
    expect(component.activeCount()).toBe(1);
    expect(component.totalSpentVolume()).toBe(47000);
  });

  it('should render customers in table rows', () => {
    const rows = fixture.nativeElement.querySelectorAll('tbody tr');
    expect(rows.length).toBe(2);

    const firstRowText = rows[0].textContent;
    expect(firstRowText).toContain('Alfa Têxtil');
    expect(firstRowText).toContain('11.222.333/0001-44');
    expect(firstRowText).toContain('João Silva');
    expect(firstRowText).toContain('São Paulo / SP');
    expect(firstRowText).toContain('Ativo');
  });

  it('should filter customers by search query', () => {
    component.searchQuery.set('Brusque');
    fixture.detectChanges();

    const rows = fixture.nativeElement.querySelectorAll('tbody tr');
    expect(rows.length).toBe(1);
    expect(rows[0].textContent).toContain('Beta Moda');
  });

  it('should filter customers by status', () => {
    component.selectedStatus.set('active');
    fixture.detectChanges();

    const rows = fixture.nativeElement.querySelectorAll('tbody tr');
    expect(rows.length).toBe(1);
    expect(rows[0].textContent).toContain('Alfa Têxtil');
  });

  it('should sort customers by totalSpent', () => {
    component.toggleSort('totalSpent');
    fixture.detectChanges();

    expect(component.sortColumn()).toBe('totalSpent');
    expect(component.sortDirection()).toBe('asc');
    expect(component.filteredCustomers()[0].totalSpent).toBe(12000);

    component.toggleSort('totalSpent');
    fixture.detectChanges();
    expect(component.sortDirection()).toBe('desc');
    expect(component.filteredCustomers()[0].totalSpent).toBe(35000);
  });

  it('should emit updateStatus event when toggle status button is clicked', () => {
    let payload: { id: string; status: CustomerStatus } | undefined;
    component.updateStatus.subscribe((p) => (payload = p));

    const toggleBtn = fixture.nativeElement.querySelector('button[title="Desativar Conta"]');
    expect(toggleBtn).toBeTruthy();
    toggleBtn.click();

    expect(payload).toBeDefined();
    expect(payload?.id).toBe('cust-1');
    expect(payload?.status).toBe('inactive');
  });

  it('should emit deleteCustomer event when delete button is clicked', () => {
    let deletedId: string | undefined;
    component.deleteCustomer.subscribe((id) => (deletedId = id));

    const deleteBtn = fixture.nativeElement.querySelector('button[title="Excluir Cadastro"]');
    expect(deleteBtn).toBeTruthy();
    deleteBtn.click();

    expect(deletedId).toBe('cust-1');
  });

  it('should render email link with correct mailto URI', () => {
    const emailLink = fixture.nativeElement.querySelector('a[href^="mailto:"]') as HTMLAnchorElement;
    expect(emailLink).toBeTruthy();
    expect(emailLink.href).toContain('mailto:joao@alfa.com.br');
  });
});
