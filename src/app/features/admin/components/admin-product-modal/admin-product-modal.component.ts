import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  inject,
  input,
  output
} from '@angular/core';
import {
  NonNullableFormBuilder,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';
import { Brand, Category, Product } from '../../../../core/models/product.model';
import { ButtonComponent } from '../../../../shared/ui/button/button.component';
import { InputComponent } from '../../../../shared/ui/input/input.component';

@Component({
  selector: 'app-admin-product-modal',
  imports: [ReactiveFormsModule, InputComponent, ButtonComponent],
  template: `
    @if (isOpen()) {
      <div
        class="fixed inset-0 z-50 overflow-y-auto bg-black/75 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6"
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-product-title"
        (click)="handleBackdropClick($event)"
      >
        <div
          class="bg-white rounded-2xl shadow-2xl border border-neutral-200 w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh] text-neutral-900 animate-in fade-in zoom-in-95 duration-150"
          (click)="$event.stopPropagation()"
        >
          <header class="p-5 sm:p-6 bg-[#101010] text-white flex items-center justify-between border-b border-neutral-800 shrink-0">
            <div class="flex items-center gap-3">
              <div class="w-8 h-8 rounded-lg bg-[#0573cc] flex items-center justify-center text-white shadow-xs font-black text-sm">
                @if (product()) {
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-4 h-4" aria-hidden="true"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>
                } @else {
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" class="w-4 h-4" aria-hidden="true"><line x1="12" x2="12" y1="5" y2="19"/><line x1="5" x2="19" y1="12" y2="12"/></svg>
                }
              </div>
              <div>
                <h2 id="modal-product-title" class="text-base sm:text-lg font-black tracking-tight text-white leading-tight">
                  {{ product() ? 'Editar Máquina Industrial' : 'Cadastrar Nova Máquina' }}
                </h2>
                <p class="text-[11px] text-neutral-400 font-medium leading-tight mt-0.5">
                  {{ product() ? 'Atualize as especificações e valores do modelo.' : 'Adicione um novo produto ao catálogo do protótipo.' }}
                </p>
              </div>
            </div>

            <button
              type="button"
              (click)="cancel.emit()"
              class="p-2 text-neutral-400 hover:text-white hover:bg-neutral-800 rounded-lg transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#077fbd]"
              aria-label="Fechar modal"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-5 h-5"><line x1="18" x2="6" y1="6" y2="18"/><line x1="6" x2="18" y1="6" y2="18"/></svg>
            </button>
          </header>

          <form [formGroup]="productForm" (submit)="handleSubmit($event)" novalidate class="flex flex-col flex-1 overflow-hidden">
            <div class="p-5 sm:p-6 overflow-y-auto space-y-4 text-xs">
              <div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div class="sm:col-span-2">
                  <app-input
                    id="modal-product-name"
                    name="name"
                    type="text"
                    label="Nome da Máquina"
                    placeholder="Ex: Máquina Reta Eletrônica Direct Drive"
                    [required]="true"
                    [formControl]="productForm.controls.name"
                    [error]="getNameError()"
                  />
                </div>

                <div>
                  <app-input
                    id="modal-product-sku"
                    name="sku"
                    type="text"
                    label="Código SKU"
                    placeholder="Ex: SKY-R8-01"
                    [required]="true"
                    [formControl]="productForm.controls.sku"
                    [error]="getSkuError()"
                  />
                </div>
              </div>

              <div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label for="modal-product-brand" class="text-xs font-semibold uppercase tracking-wider text-neutral-800 block mb-1.5">
                    Marca <span class="text-red-600 ml-0.5" aria-hidden="true">*</span>
                  </label>
                  <select
                    id="modal-product-brand"
                    [formControl]="productForm.controls.brand"
                    class="w-full px-3 py-2 text-sm bg-white border border-neutral-300 rounded-md text-neutral-900 focus:outline-none focus:border-[#077fbd] focus:ring-2 focus:ring-[#077fbd]/20 transition-all cursor-pointer"
                  >
                    @for (b of brandOptions(); track b) {
                      <option [value]="b">{{ b }}</option>
                    }
                  </select>
                </div>

                <div>
                  <label for="modal-product-category" class="text-xs font-semibold uppercase tracking-wider text-neutral-800 block mb-1.5">
                    Categoria <span class="text-red-600 ml-0.5" aria-hidden="true">*</span>
                  </label>
                  <select
                    id="modal-product-category"
                    [formControl]="productForm.controls.category"
                    class="w-full px-3 py-2 text-sm bg-white border border-neutral-300 rounded-md text-neutral-900 focus:outline-none focus:border-[#077fbd] focus:ring-2 focus:ring-[#077fbd]/20 transition-all cursor-pointer"
                  >
                    @for (c of categoryOptions(); track c) {
                      <option [value]="c">{{ c }}</option>
                    }
                  </select>
                </div>

                <div>
                  <app-input
                    id="modal-product-price"
                    name="price"
                    type="number"
                    label="Preço B2B (R$)"
                    placeholder="Ex: 4500"
                    [required]="true"
                    [formControl]="productForm.controls.price"
                    [error]="getPriceError()"
                  />
                </div>
              </div>

              <div>
                <app-input
                  id="modal-product-image"
                  name="imageUrl"
                  type="text"
                  label="URL da Imagem do Produto"
                  placeholder="/images/products/skymak-r8.webp ou URL externa"
                  [formControl]="productForm.controls.imageUrl"
                  hint="Caminho relativo da imagem estática ou URL pública."
                />
              </div>

              <div>
                <label for="modal-product-description" class="text-xs font-semibold uppercase tracking-wider text-neutral-800 block mb-1.5">
                  Descrição Resumida <span class="text-red-600 ml-0.5" aria-hidden="true">*</span>
                </label>
                <textarea
                  id="modal-product-description"
                  [formControl]="productForm.controls.shortDescription"
                  rows="2"
                  placeholder="Informações principais de aplicação e uso da máquina..."
                  class="w-full px-3.5 py-2.5 text-sm bg-white text-neutral-900 border border-neutral-300 rounded-md transition-all placeholder:text-neutral-400 focus:outline-none focus:border-[#077fbd] focus:ring-2 focus:ring-[#077fbd]/20"
                ></textarea>
                @if (getDescriptionError()) {
                  <p class="text-xs font-medium text-red-600 mt-0.5">{{ getDescriptionError() }}</p>
                }
              </div>

              <div>
                <label for="modal-product-differentials" class="text-xs font-semibold uppercase tracking-wider text-neutral-800 block mb-1.5">
                  Diferenciais Técnicos (um por linha)
                </label>
                <textarea
                  id="modal-product-differentials"
                  [formControl]="productForm.controls.differentials"
                  rows="3"
                  placeholder="Motor Direct Drive Integrado&#10;Corte de Linha Automático&#10;Painel Digital Touch"
                  class="w-full px-3.5 py-2.5 text-sm font-mono bg-white text-neutral-900 border border-neutral-300 rounded-md transition-all placeholder:text-neutral-400 focus:outline-none focus:border-[#077fbd] focus:ring-2 focus:ring-[#077fbd]/20 text-xs"
                ></textarea>
              </div>

              <div class="pt-1 flex items-center gap-2">
                <input
                  id="modal-product-featured"
                  type="checkbox"
                  [formControl]="productForm.controls.isFeatured"
                  class="w-4 h-4 text-[#077fbd] rounded border-neutral-300 focus:ring-[#077fbd] cursor-pointer"
                />
                <label for="modal-product-featured" class="text-xs font-semibold text-neutral-800 cursor-pointer select-none">
                  Destacar este produto na página inicial (Best Sellers)
                </label>
              </div>
            </div>

            <footer class="p-4 sm:p-5 bg-neutral-50 border-t border-neutral-200 flex items-center justify-end gap-3 shrink-0">
              <app-button
                type="button"
                variant="outline"
                size="md"
                (clicked)="cancel.emit()"
                ariaLabel="Cancelar edição"
              >
                <span>Cancelar</span>
              </app-button>

              <app-button
                type="submit"
                variant="primary"
                size="md"
                [ariaLabel]="product() ? 'Salvar alterações do produto' : 'Cadastrar novo produto'"
              >
                <span>{{ product() ? 'Salvar Alterações' : 'Cadastrar Máquina' }}</span>
              </app-button>
            </footer>
          </form>
        </div>
      </div>
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '(document:keydown.escape)': 'handleEscape()'
  }
})
export class AdminProductModalComponent {
  private readonly fb = inject(NonNullableFormBuilder);

  readonly isOpen = input<boolean>(false);
  readonly product = input<Product | null>(null);
  readonly availableBrands = input<string[]>([]);
  readonly availableCategories = input<string[]>([]);

  readonly save = output<Product>();
  readonly cancel = output<void>();

  readonly productForm = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(3)]],
    sku: ['', [Validators.required, Validators.minLength(2)]],
    brand: ['SKYMAK', [Validators.required]],
    category: ['Reta', [Validators.required]],
    price: [3000, [Validators.required, Validators.min(1)]],
    imageUrl: ['/images/products/skymak-r8.webp'],
    shortDescription: ['', [Validators.required, Validators.minLength(5)]],
    differentials: [''],
    isFeatured: [false]
  });

  readonly brandOptions = computed<string[]>(() => {
    const list = this.availableBrands();
    return list.length > 0 ? list : ['SKYMAK', 'Jack', 'Sun Special', 'Siruba', 'Zoje', 'Sansei', 'Singer'];
  });

  readonly categoryOptions = computed<string[]>(() => {
    const list = this.availableCategories();
    return list.length > 0 ? list : ['Reta', 'Overlock', 'Galoneira', 'Travete', 'Botoneira', 'Corte'];
  });

  constructor() {
    effect(() => {
      const prod = this.product();
      if (prod) {
        this.productForm.setValue({
          name: prod.name,
          sku: prod.sku,
          brand: prod.brand,
          category: prod.category,
          price: prod.price,
          imageUrl: prod.images.length > 0 ? prod.images[0] : '',
          shortDescription: prod.shortDescription,
          differentials: prod.differentials.join('\n'),
          isFeatured: !!prod.isFeatured
        });
      } else {
        this.productForm.reset({
          name: '',
          sku: '',
          brand: this.brandOptions()[0] || 'SKYMAK',
          category: this.categoryOptions()[0] || 'Reta',
          price: 3000,
          imageUrl: '/images/products/skymak-r8.webp',
          shortDescription: '',
          differentials: '',
          isFeatured: false
        });
      }
    });
  }

  handleEscape(): void {
    if (this.isOpen()) {
      this.cancel.emit();
    }
  }

  handleBackdropClick(event: MouseEvent): void {
    if (event.target === event.currentTarget) {
      this.cancel.emit();
    }
  }

  getNameError(): string | null {
    const control = this.productForm.controls.name;
    if (!control.touched && !control.dirty) return null;
    if (control.hasError('required')) return 'O nome da máquina é obrigatório.';
    if (control.hasError('minlength')) return 'O nome deve ter no mínimo 3 caracteres.';
    return null;
  }

  getSkuError(): string | null {
    const control = this.productForm.controls.sku;
    if (!control.touched && !control.dirty) return null;
    if (control.hasError('required')) return 'O código SKU é obrigatório.';
    if (control.hasError('minlength')) return 'O SKU deve ter no mínimo 2 caracteres.';
    return null;
  }

  getPriceError(): string | null {
    const control = this.productForm.controls.price;
    if (!control.touched && !control.dirty) return null;
    if (control.hasError('required')) return 'O preço é obrigatório.';
    if (control.hasError('min')) return 'O preço deve ser superior a R$ 0,00.';
    return null;
  }

  getDescriptionError(): string | null {
    const control = this.productForm.controls.shortDescription;
    if (!control.touched && !control.dirty) return null;
    if (control.hasError('required')) return 'A descrição é obrigatória.';
    if (control.hasError('minlength')) return 'A descrição deve ter no mínimo 5 caracteres.';
    return null;
  }

  handleSubmit(event: Event): void {
    event.preventDefault();

    if (this.productForm.invalid) {
      this.productForm.markAllAsTouched();
      return;
    }

    const raw = this.productForm.getRawValue();
    const differentials = raw.differentials
      .split('\n')
      .map((d) => d.trim())
      .filter((d) => d.length > 0);

    const productPayload: Product = {
      id: this.product()?.id || `prod-${Date.now()}`,
      sku: raw.sku.trim().toUpperCase(),
      name: raw.name.trim(),
      brand: raw.brand as Brand,
      category: raw.category as Category,
      price: Number(raw.price),
      images: raw.imageUrl.trim() ? [raw.imageUrl.trim()] : ['/images/products/skymak-r8.webp'],
      shortDescription: raw.shortDescription.trim(),
      differentials: differentials.length > 0 ? differentials : ['Motor Direct Drive', 'Alta Performance Industrial'],
      specifications: this.product()?.specifications || {
        'Velocidade Máxima': '5.000 rpm',
        'Tipo de Ponto': raw.category,
        'Lubrificação': 'Automática por bomba',
        'Voltagem': 'Bivolt Automático'
      },
      isFeatured: raw.isFeatured
    };

    this.save.emit(productPayload);
  }
}
