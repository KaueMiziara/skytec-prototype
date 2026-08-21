import { Product } from './product.model';

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface CartSummary {
  items: CartItem[];
  totalCount: number;
  subtotal: number;
}
