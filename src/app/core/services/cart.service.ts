import { Injectable, computed, signal } from '@angular/core';
import { CartItem } from '../models/cart.model';
import { Product } from '../models/product.model';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private readonly itemsSignal = signal<CartItem[]>([]);
  private readonly drawerOpenSignal = signal<boolean>(false);

  readonly items = this.itemsSignal.asReadonly();
  readonly isDrawerOpen = this.drawerOpenSignal.asReadonly();

  readonly totalCount = computed<number>(() => {
    return this.itemsSignal().reduce((total, item) => total + item.quantity, 0);
  });

  readonly subtotal = computed<number>(() => {
    return this.itemsSignal().reduce((total, item) => total + item.product.price * item.quantity, 0);
  });

  readonly isEmpty = computed<boolean>(() => {
    return this.itemsSignal().length === 0;
  });

  addItem(product: Product, quantity = 1): void {
    if (quantity <= 0) {
      return;
    }

    this.itemsSignal.update((current) => {
      const existingIndex = current.findIndex((item) => item.product.id === product.id);
      if (existingIndex > -1) {
        return current.map((item, index) =>
          index === existingIndex ? { ...item, quantity: item.quantity + quantity } : item
        );
      }
      return [...current, { product, quantity }];
    });
  }

  removeItem(productId: string): void {
    this.itemsSignal.update((current) => current.filter((item) => item.product.id !== productId));
  }

  updateQuantity(productId: string, quantity: number): void {
    if (quantity <= 0) {
      this.removeItem(productId);
      return;
    }

    this.itemsSignal.update((current) =>
      current.map((item) => (item.product.id === productId ? { ...item, quantity } : item))
    );
  }

  clearCart(): void {
    this.itemsSignal.set([]);
  }

  openDrawer(): void {
    this.drawerOpenSignal.set(true);
  }

  closeDrawer(): void {
    this.drawerOpenSignal.set(false);
  }

  toggleDrawer(): void {
    this.drawerOpenSignal.update((state) => !state);
  }

  generateWhatsAppLink(phoneNumber = '5511999999999'): string {
    const items = this.itemsSignal();
    if (items.length === 0) {
      const emptyMessage = 'Olá! Gostaria de falar com um consultor da SKYTEC.';
      return `https://wa.me/${phoneNumber}?text=${encodeURIComponent(emptyMessage)}`;
    }

    const lines: string[] = [
      'Olá! Gostaria de solicitar um orçamento para os seguintes itens da SKYTEC:',
      ''
    ];

    for (const item of items) {
      const itemTotal = (item.product.price * item.quantity).toLocaleString('pt-BR', {
        style: 'currency',
        currency: 'BRL'
      });
      lines.push(`• [${item.product.sku}] ${item.product.name} (Qtd: ${item.quantity}) - ${itemTotal}`);
    }

    const totalFormatted = this.subtotal().toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    });

    lines.push('');
    lines.push(`Valor Total Estimado: ${totalFormatted}`);

    const fullMessage = lines.join('\n');
    return `https://wa.me/${phoneNumber}?text=${encodeURIComponent(fullMessage)}`;
  }
}
