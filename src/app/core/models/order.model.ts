export type OrderStatus = 'pending' | 'in_negotiation' | 'approved' | 'cancelled';

export interface OrderItem {
  sku: string;
  productName: string;
  quantity: number;
  unitPrice: number;
}

export interface Order {
  id: string;
  quoteNumber: string;
  clientName: string;
  cnpjCpf: string;
  email: string;
  phone: string;
  items: OrderItem[];
  itemsCount: number;
  totalValue: number;
  status: OrderStatus;
  createdAt: string;
  paymentTerms: string;
  notes?: string;
}
