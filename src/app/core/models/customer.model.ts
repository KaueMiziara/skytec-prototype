export type CustomerStatus = 'active' | 'inactive' | 'pending';

export interface Customer {
  id: string;
  companyName: string;
  tradeName: string;
  cnpjCpf: string;
  contactName: string;
  email: string;
  phone: string;
  cityState: string;
  segment: string;
  ordersCount: number;
  totalSpent: number;
  status: CustomerStatus;
  registeredAt: string;
}
