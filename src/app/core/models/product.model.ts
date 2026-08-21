export type Category =
  | 'Reta'
  | 'Overlock'
  | 'Galoneira'
  | 'Travete'
  | 'Botoneira'
  | 'Caseadeira'
  | 'Pespontadeira'
  | 'Corte'
  | 'Outros'
  | string;

export type Brand =
  | 'Jack'
  | 'Sun Special'
  | 'Siruba'
  | 'Zoje'
  | 'Sansei'
  | 'Brother'
  | 'Singer'
  | 'Lanmax'
  | 'SKYMAK'
  | string;

export type ProductSpecification = Record<string, string>;

export interface Product {
  id: string;
  sku: string;
  name: string;
  brand: Brand;
  category: Category;
  price: number;
  images: string[];
  shortDescription: string;
  differentials: string[];
  specifications: ProductSpecification;
  isFeatured?: boolean;
}

export type ProductSortOption = 'price-asc' | 'price-desc' | 'name-asc' | 'name-desc';

export interface ProductFilterState {
  query: string;
  brands: string[];
  categories: string[];
  minPrice: number | null;
  maxPrice: number | null;
  sortBy: ProductSortOption;
}

export const DEFAULT_FILTER_STATE: ProductFilterState = {
  query: '',
  brands: [],
  categories: [],
  minPrice: null,
  maxPrice: null,
  sortBy: 'price-asc'
};

export interface ProductsData {
  products: Product[];
}
