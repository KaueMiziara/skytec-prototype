import { TestBed } from '@angular/core/testing';
import { AdminDataService } from './admin-data.service';

describe('AdminDataService', () => {
  let service: AdminDataService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AdminDataService]
    });
    service = TestBed.inject(AdminDataService);
  });

  it('should be created with initial orders and customers data', () => {
    expect(service).toBeTruthy();
    expect(service.orders().length).toBeGreaterThan(0);
    expect(service.customers().length).toBeGreaterThan(0);
  });

  it('should compute pending orders count and active customers count accurately', () => {
    const pendingCount = service.orders().filter((o) => o.status === 'pending').length;
    expect(service.pendingOrdersCount()).toBe(pendingCount);

    const activeCount = service.customers().filter((c) => c.status === 'active').length;
    expect(service.activeCustomersCount()).toBe(activeCount);
  });

  it('should compute total orders volume excluding cancelled orders', () => {
    const expectedVolume = service
      .orders()
      .filter((o) => o.status !== 'cancelled')
      .reduce((sum, o) => sum + o.totalValue, 0);

    expect(service.totalOrdersVolume()).toBe(expectedVolume);
  });

  it('should update order status', () => {
    const firstOrder = service.orders()[0];
    service.updateOrderStatus(firstOrder.id, 'approved');

    const updated = service.orders().find((o) => o.id === firstOrder.id);
    expect(updated?.status).toBe('approved');
  });

  it('should delete an order', () => {
    const initialCount = service.orders().length;
    const firstOrder = service.orders()[0];

    service.deleteOrder(firstOrder.id);
    expect(service.orders().length).toBe(initialCount - 1);
    expect(service.orders().find((o) => o.id === firstOrder.id)).toBeUndefined();
  });

  it('should update customer status', () => {
    const firstCustomer = service.customers()[0];
    service.updateCustomerStatus(firstCustomer.id, 'inactive');

    const updated = service.customers().find((c) => c.id === firstCustomer.id);
    expect(updated?.status).toBe('inactive');
  });

  it('should delete a customer', () => {
    const initialCount = service.customers().length;
    const firstCustomer = service.customers()[0];

    service.deleteCustomer(firstCustomer.id);
    expect(service.customers().length).toBe(initialCount - 1);
    expect(service.customers().find((c) => c.id === firstCustomer.id)).toBeUndefined();
  });
});
