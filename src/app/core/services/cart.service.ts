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

  generateWhatsAppLink(
    phoneNumber = '5511999999999',
    customer?: { name?: string; cnpjCpf?: string }
  ): string {
    const items = this.itemsSignal();
    if (items.length === 0) {
      const emptyMessage = 'Olá! Gostaria de falar com um consultor da SKYTEC Máquinas.';
      return `https://wa.me/${phoneNumber}?text=${encodeURIComponent(emptyMessage)}`;
    }

    const lines: string[] = [
      '*SOLICITAÇÃO DE COTAÇÃO B2B — SKYTEC MÁQUINAS*',
      '----------------------------------------'
    ];

    if (customer?.name) {
      lines.push(`*Cliente:* ${customer.name}`);
      if (customer.cnpjCpf) {
        lines.push(`*Documento (CNPJ/CPF):* ${customer.cnpjCpf}`);
      }
      lines.push('----------------------------------------');
    }

    lines.push('*ITENS SOLICITADOS:*');
    for (const item of items) {
      const unitFormatted = item.product.price.toLocaleString('pt-BR', {
        style: 'currency',
        currency: 'BRL'
      });
      const itemTotalFormatted = (item.product.price * item.quantity).toLocaleString('pt-BR', {
        style: 'currency',
        currency: 'BRL'
      });
      lines.push(
        `• [${item.product.sku}] ${item.product.name}\n  Qtd: ${item.quantity} | Unit: ${unitFormatted} | Subtotal: ${itemTotalFormatted}`
      );
    }

    const totalFormatted = this.subtotal().toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    });

    lines.push('----------------------------------------');
    lines.push(`*VALOR TOTAL ESTIMADO:* ${totalFormatted}`);
    lines.push(`*Total de Itens:* ${this.totalCount()}`);
    lines.push('*Condição:* Faturamento PJ / Cartão BNDES / À Vista');
    lines.push('----------------------------------------');
    lines.push('Solicito contato de um consultor para confirmação de estoque, impostos e frete.');

    const fullMessage = lines.join('\n');
    return `https://wa.me/${phoneNumber}?text=${encodeURIComponent(fullMessage)}`;
  }

  generateProductWhatsAppLink(
    product: Product,
    quantity = 1,
    phoneNumber = '5511999999999',
    customer?: { name?: string; cnpjCpf?: string }
  ): string {
    const unitFormatted = product.price.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    });
    const totalFormatted = (product.price * quantity).toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    });

    const lines: string[] = [
      '*CONSULTA TÉCNICA / COTAÇÃO — SKYTEC MÁQUINAS*',
      '----------------------------------------'
    ];

    if (customer?.name) {
      lines.push(`*Cliente:* ${customer.name}`);
      if (customer.cnpjCpf) {
        lines.push(`*Documento (CNPJ/CPF):* ${customer.cnpjCpf}`);
      }
      lines.push('----------------------------------------');
    }

    lines.push(`*Produto:* [${product.sku}] ${product.name}`);
    lines.push(`*Marca:* ${product.brand} | *Categoria:* ${product.category}`);
    lines.push(`*Quantidade:* ${quantity}`);
    lines.push(`*Valor Unitário:* ${unitFormatted}`);
    lines.push(`*Valor Total Estimado:* ${totalFormatted}`);
    lines.push('----------------------------------------');
    lines.push('Gostaria de consultar disponibilidade, prazos de entrega e condições de faturamento PJ.');

    const fullMessage = lines.join('\n');
    return `https://wa.me/${phoneNumber}?text=${encodeURIComponent(fullMessage)}`;
  }
}
