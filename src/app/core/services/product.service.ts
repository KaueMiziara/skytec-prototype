import { Injectable, computed, signal } from '@angular/core';
import productsData from '../data/products.json';
import { Product, ProductsData } from '../models/product.model';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private readonly initialData = productsData as unknown as ProductsData;
  private readonly productsSignal = signal<Product[]>(this.initialData.products);

  readonly products = this.productsSignal.asReadonly();

  readonly categories = computed<string[]>(() => {
    return Array.from(new Set(this.productsSignal().map((p) => p.category)));
  });

  readonly brands = computed<string[]>(() => {
    return Array.from(new Set(this.productsSignal().map((p) => p.brand)));
  });

  readonly featuredProducts = computed<Product[]>(() => {
    const list = this.productsSignal();
    const explicitFeatured = list.filter((p) => p.isFeatured);
    return explicitFeatured.length > 0 ? explicitFeatured : list.slice(0, 4);
  });

  getProductById(id: string): Product | undefined {
    return this.productsSignal().find((product) => product.id === id);
  }

  getProductBySku(sku: string): Product | undefined {
    return this.productsSignal().find((product) => product.sku.toLowerCase() === sku.toLowerCase());
  }

  getRelatedProducts(productId: string, limit = 4): Product[] {
    const current = this.getProductById(productId);
    if (!current) {
      return this.productsSignal().slice(0, limit);
    }

    const sameCategoryOrBrand = this.productsSignal().filter(
      (product) =>
        product.id !== productId &&
        (product.category === current.category || product.brand === current.brand)
    );

    if (sameCategoryOrBrand.length >= limit) {
      return sameCategoryOrBrand.slice(0, limit);
    }

    const remaining = this.productsSignal().filter(
      (product) => product.id !== productId && !sameCategoryOrBrand.some((p) => p.id === product.id)
    );

    return [...sameCategoryOrBrand, ...remaining].slice(0, limit);
  }

  addProduct(product: Product): void {
    this.productsSignal.update((current) => [...current, product]);
  }

  updateProduct(id: string, partial: Partial<Product>): void {
    this.productsSignal.update((current) =>
      current.map((product) => (product.id === id ? { ...product, ...partial } : product))
    );
  }

  deleteProduct(id: string): void {
    this.productsSignal.update((current) => current.filter((product) => product.id !== id));
  }
}
