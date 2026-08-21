import { Injectable, computed, signal } from '@angular/core';
import { Customer, CustomerStatus } from '../models/customer.model';
import { Order, OrderStatus } from '../models/order.model';

@Injectable({
  providedIn: 'root'
})
export class AdminDataService {
  private readonly initialOrders: Order[] = [
    {
      id: 'ord-001',
      quoteNumber: 'COT-2026-081',
      clientName: 'Confecções Paulista Ltda',
      cnpjCpf: '12.345.678/0001-90',
      email: 'compras@confeccoespaulista.com.br',
      phone: '(11) 98765-4321',
      itemsCount: 4,
      totalValue: 18500,
      status: 'pending',
      createdAt: '21/08/2026',
      paymentTerms: 'Boleto Faturado 30/60 dias',
      notes: 'Solicitou inclusão de treinamento operacional na entrega.',
      items: [
        { sku: 'SKY-R8', productName: 'Reta Eletrônica Direct Drive SKYMAK R8', quantity: 2, unitPrice: 4890 },
        { sku: 'SIR-747K', productName: 'Overlock 4 Fios Siruba 747K Direct Drive', quantity: 2, unitPrice: 4360 }
      ]
    },
    {
      id: 'ord-002',
      quoteNumber: 'COT-2026-080',
      clientName: 'Moda Sul Ateliê Têxtil',
      cnpjCpf: '98.765.432/0001-10',
      email: 'contato@modasul.com.br',
      phone: '(47) 99123-8877',
      itemsCount: 2,
      totalValue: 9780,
      status: 'in_negotiation',
      createdAt: '20/08/2026',
      paymentTerms: 'Cartão BNDES em 12x',
      notes: 'Aguardando aprovação de crédito junto à agência.',
      items: [
        { sku: 'SKY-R8', productName: 'Reta Eletrônica Direct Drive SKYMAK R8', quantity: 2, unitPrice: 4890 }
      ]
    },
    {
      id: 'ord-003',
      quoteNumber: 'COT-2026-079',
      clientName: 'Têxtil Nordeste Uniformes S/A',
      cnpjCpf: '45.678.901/0001-23',
      email: 'diretoria@textilnordeste.com.br',
      phone: '(81) 98877-6655',
      itemsCount: 8,
      totalValue: 42300,
      status: 'approved',
      createdAt: '19/08/2026',
      paymentTerms: 'À vista com 5% de desconto via PIX',
      notes: 'Orçamento aprovado. Envio agendado via transportadora parceira.',
      items: [
        { sku: 'JACK-A4F', productName: 'Reta Industrial Jack A4F Inteligente', quantity: 5, unitPrice: 5100 },
        { sku: 'SUN-C5', productName: 'Galoneira Base Plana Sun Special C5', quantity: 3, unitPrice: 5600 }
      ]
    },
    {
      id: 'ord-004',
      quoteNumber: 'COT-2026-078',
      clientName: 'Jeans & Cia Confecção ME',
      cnpjCpf: '33.222.111/0001-44',
      email: 'financeiro@jeanscia.com.br',
      phone: '(19) 97766-5544',
      itemsCount: 3,
      totalValue: 16200,
      status: 'pending',
      createdAt: '18/08/2026',
      paymentTerms: 'Boleto 28/56 dias',
      notes: 'Cliente solicitou máquinas para costura de tecido pesado (denim).',
      items: [
        { sku: 'ZOJE-ZJ9703', productName: 'Reta Pesada Zoje Direct Drive', quantity: 2, unitPrice: 5400 },
        { sku: 'SIR-757K', productName: 'Interlock 5 Fios Siruba 757K', quantity: 1, unitPrice: 5400 }
      ]
    },
    {
      id: 'ord-005',
      quoteNumber: 'COT-2026-077',
      clientName: 'Costura Criativa Design',
      cnpjCpf: '77.888.999/0001-55',
      email: 'atelie@costuracriativa.com.br',
      phone: '(44) 99988-1122',
      itemsCount: 1,
      totalValue: 4890,
      status: 'approved',
      createdAt: '16/08/2026',
      paymentTerms: 'PIX Faturado',
      notes: 'Faturamento emitido.',
      items: [
        { sku: 'SKY-R8', productName: 'Reta Eletrônica Direct Drive SKYMAK R8', quantity: 1, unitPrice: 4890 }
      ]
    },
    {
      id: 'ord-006',
      quoteNumber: 'COT-2026-076',
      clientName: 'Moda Praia Tropical Eireli',
      cnpjCpf: '55.444.333/0001-66',
      email: 'compras@modapraiatropical.com.br',
      phone: '(85) 98111-2233',
      itemsCount: 2,
      totalValue: 8800,
      status: 'cancelled',
      createdAt: '14/08/2026',
      paymentTerms: 'Boleto Bancário',
      notes: 'Cliente optou por adiar a compra para a próxima coleção.',
      items: [
        { sku: 'SIR-747K', productName: 'Overlock 4 Fios Siruba 747K', quantity: 2, unitPrice: 4400 }
      ]
    }
  ];

  private readonly initialCustomers: Customer[] = [
    {
      id: 'cust-001',
      companyName: 'Confecções Paulista Indústria e Comércio Ltda',
      tradeName: 'Confecções Paulista',
      cnpjCpf: '12.345.678/0001-90',
      contactName: 'Carlos Eduardo Mendes',
      email: 'compras@confeccoespaulista.com.br',
      phone: '(11) 98765-4321',
      cityState: 'São Paulo / SP',
      segment: 'Camisaria & Alfaiataria',
      ordersCount: 5,
      totalSpent: 48500,
      status: 'active',
      registeredAt: '12/01/2025'
    },
    {
      id: 'cust-002',
      companyName: 'Moda Sul Comércio de Artigos Têxteis Eireli',
      tradeName: 'Moda Sul Ateliê',
      cnpjCpf: '98.765.432/0001-10',
      contactName: 'Mariana Schneider',
      email: 'contato@modasul.com.br',
      phone: '(47) 99123-8877',
      cityState: 'Brusque / SC',
      segment: 'Malharia & Moda Íntima',
      ordersCount: 3,
      totalSpent: 28900,
      status: 'active',
      registeredAt: '05/03/2025'
    },
    {
      id: 'cust-003',
      companyName: 'Têxtil Nordeste Uniformes Profissionais S/A',
      tradeName: 'Têxtil Nordeste Uniformes',
      cnpjCpf: '45.678.901/0001-23',
      contactName: 'Roberto Albuquerque',
      email: 'diretoria@textilnordeste.com.br',
      phone: '(81) 98877-6655',
      cityState: 'Caruaru / PE',
      segment: 'Uniformes Profissionais',
      ordersCount: 8,
      totalSpent: 112000,
      status: 'active',
      registeredAt: '18/06/2024'
    },
    {
      id: 'cust-004',
      companyName: 'Jeans & Cia Confecção ME',
      tradeName: 'Jeans & Cia',
      cnpjCpf: '33.222.111/0001-44',
      contactName: 'Antônio Ferreira',
      email: 'financeiro@jeanscia.com.br',
      phone: '(19) 97766-5544',
      cityState: 'Americana / SP',
      segment: 'Confecção Jeans & Sarja',
      ordersCount: 2,
      totalSpent: 16200,
      status: 'active',
      registeredAt: '02/09/2025'
    },
    {
      id: 'cust-005',
      companyName: 'Costura Criativa Design de Moda Ltda',
      tradeName: 'Costura Criativa',
      cnpjCpf: '77.888.999/0001-55',
      contactName: 'Luciana Martins',
      email: 'atelie@costuracriativa.com.br',
      phone: '(44) 99988-1122',
      cityState: 'Maringá / PR',
      segment: 'Ateliê & Moda Feminina',
      ordersCount: 4,
      totalSpent: 19400,
      status: 'active',
      registeredAt: '14/11/2024'
    },
    {
      id: 'cust-006',
      companyName: 'Moda Praia Tropical Comércio Eireli',
      tradeName: 'Tropical Beachwear',
      cnpjCpf: '55.444.333/0001-66',
      contactName: 'Fernanda Lima',
      email: 'compras@modapraiatropical.com.br',
      phone: '(85) 98111-2233',
      cityState: 'Fortaleza / CE',
      segment: 'Moda Praia & Fitness',
      ordersCount: 1,
      totalSpent: 8800,
      status: 'inactive',
      registeredAt: '20/02/2025'
    },
    {
      id: 'cust-007',
      companyName: 'Belo Horizonte Couros & Calçados S/A',
      tradeName: 'BH Couros',
      cnpjCpf: '22.333.444/0001-77',
      contactName: 'Marcos Vinícius Costa',
      email: 'marcos@bhcouros.com.br',
      phone: '(31) 98822-3344',
      cityState: 'Belo Horizonte / MG',
      segment: 'Calçados & Couro Pesado',
      ordersCount: 0,
      totalSpent: 0,
      status: 'pending',
      registeredAt: '19/08/2026'
    },
    {
      id: 'cust-008',
      companyName: 'Goiás Malhas & Fardamentos Ltda',
      tradeName: 'Goiás Fardamentos',
      cnpjCpf: '66.777.888/0001-88',
      contactName: 'Juliana Prado',
      email: 'juliana@goiasmalhas.com.br',
      phone: '(62) 99133-4455',
      cityState: 'Goiânia / GO',
      segment: 'Malharia Promocional',
      ordersCount: 2,
      totalSpent: 14500,
      status: 'active',
      registeredAt: '10/05/2025'
    }
  ];

  private readonly ordersSignal = signal<Order[]>(this.initialOrders);
  private readonly customersSignal = signal<Customer[]>(this.initialCustomers);

  readonly orders = this.ordersSignal.asReadonly();
  readonly customers = this.customersSignal.asReadonly();

  readonly pendingOrdersCount = computed<number>(() => {
    return this.ordersSignal().filter((o) => o.status === 'pending').length;
  });

  readonly totalOrdersVolume = computed<number>(() => {
    return this.ordersSignal()
      .filter((o) => o.status !== 'cancelled')
      .reduce((acc, curr) => acc + curr.totalValue, 0);
  });

  readonly activeCustomersCount = computed<number>(() => {
    return this.customersSignal().filter((c) => c.status === 'active').length;
  });

  readonly totalCustomerVolume = computed<number>(() => {
    return this.customersSignal().reduce((acc, curr) => acc + curr.totalSpent, 0);
  });

  updateOrderStatus(orderId: string, newStatus: OrderStatus): void {
    this.ordersSignal.update((orders) =>
      orders.map((order) => (order.id === orderId ? { ...order, status: newStatus } : order))
    );
  }

  deleteOrder(orderId: string): void {
    this.ordersSignal.update((orders) => orders.filter((o) => o.id !== orderId));
  }

  updateCustomerStatus(customerId: string, newStatus: CustomerStatus): void {
    this.customersSignal.update((customers) =>
      customers.map((c) => (c.id === customerId ? { ...c, status: newStatus } : c))
    );
  }

  deleteCustomer(customerId: string): void {
    this.customersSignal.update((customers) => customers.filter((c) => c.id !== customerId));
  }
}
