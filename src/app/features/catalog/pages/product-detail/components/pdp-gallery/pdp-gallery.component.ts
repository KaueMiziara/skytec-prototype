import { ChangeDetectionStrategy, Component, computed, input, signal } from '@angular/core';

@Component({
  selector: 'app-pdp-gallery',
  template: `
    <section aria-label="Galeria de imagens do produto" class="flex flex-col gap-4">
      <div class="relative w-full aspect-4/3 sm:aspect-square bg-[#f5f5f7] border border-neutral-200 rounded-2xl p-6 sm:p-8 flex items-center justify-center overflow-hidden">
        <div class="absolute top-4 left-4 z-10 flex flex-wrap gap-1.5">
          @if (brand()) {
            <span class="inline-block px-2.5 py-1 rounded text-xs font-mono font-bold uppercase tracking-wider bg-neutral-900 text-white">
              {{ brand() }}
            </span>
          }
          @if (category()) {
            <span class="inline-block px-2.5 py-1 rounded text-xs font-semibold uppercase tracking-wider bg-[#0573cc]/10 text-[#0573cc] border border-[#0573cc]/20">
              {{ category() }}
            </span>
          }
        </div>

        @if (sku()) {
          <div class="absolute top-4 right-4 z-10">
            <span class="text-xs font-mono text-neutral-600 font-semibold bg-white/90 px-2 py-1 rounded border border-neutral-200 shadow-xs">
              {{ sku() }}
            </span>
          </div>
        }

        <div class="w-full h-full flex items-center justify-center">
          @if (isCurrentImageValid()) {
            <img
              [src]="activeImage()"
              [alt]="productName() || 'Imagem do produto'"
              (error)="handleImageError(selectedImageIndex())"
              class="max-h-full max-w-full object-contain transition-all duration-200 select-none"
            />
          } @else {
            <div class="flex flex-col items-center justify-center text-[#0573cc] gap-3">
              <div class="w-24 h-24 sm:w-32 sm:h-32 rounded-full bg-white border border-neutral-200/80 flex items-center justify-center shadow-inner">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" class="w-12 h-12 sm:w-16 sm:h-16" aria-hidden="true">
                  <rect x="2" y="6" width="20" height="12" rx="2" />
                  <path d="M6 12h.01" />
                  <path d="M10 12h.01" />
                  <path d="M14 12h.01" />
                  <path d="M18 12h.01" />
                  <path d="M12 2v4" />
                  <path d="M12 18v4" />
                </svg>
              </div>
              <span class="text-xs font-medium text-neutral-400">Imagem não disponível</span>
            </div>
          }
        </div>

        @if (hasMultipleImages()) {
          <button
            type="button"
            (click)="previousImage()"
            class="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/90 hover:bg-white text-neutral-800 shadow-md border border-neutral-200 flex items-center justify-center transition-transform hover:scale-105 active:scale-95 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#077fbd]"
            aria-label="Imagem anterior"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-5 h-5" aria-hidden="true">
              <polyline points="15 18 9 12 15 6"></polyline>
            </svg>
          </button>

          <button
            type="button"
            (click)="nextImage()"
            class="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/90 hover:bg-white text-neutral-800 shadow-md border border-neutral-200 flex items-center justify-center transition-transform hover:scale-105 active:scale-95 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#077fbd]"
            aria-label="Próxima imagem"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-5 h-5" aria-hidden="true">
              <polyline points="9 18 15 12 9 6"></polyline>
            </svg>
          </button>
        }
      </div>

      @if (hasMultipleImages()) {
        <div class="flex items-center gap-3 overflow-x-auto pb-1" role="tablist" aria-label="Miniaturas da galeria">
          @for (image of images(); track $index) {
            <button
              type="button"
              role="tab"
              [attr.aria-selected]="selectedImageIndex() === $index"
              [attr.aria-label]="'Exibir imagem ' + ($index + 1) + ' de ' + images().length"
              (click)="selectImage($index)"
              class="relative w-18 h-18 sm:w-20 sm:h-20 rounded-xl bg-[#f5f5f7] border-2 p-1.5 flex items-center justify-center overflow-hidden transition-all cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#077fbd]"
              [class.border-[#0573cc]]="selectedImageIndex() === $index"
              [class.ring-2]="selectedImageIndex() === $index"
              [class.ring-[#0573cc]/30]="selectedImageIndex() === $index"
              [class.border-neutral-200]="selectedImageIndex() !== $index"
              [class.hover:border-neutral-400]="selectedImageIndex() !== $index"
            >
              @if (!isThumbnailFailed($index)) {
                <img
                  [src]="image"
                  [alt]="(productName() || 'Produto') + ' - miniatura ' + ($index + 1)"
                  (error)="handleImageError($index)"
                  class="max-h-full max-w-full object-contain"
                />
              } @else {
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" class="w-6 h-6 text-neutral-400" aria-hidden="true">
                  <rect x="2" y="6" width="20" height="12" rx="2" />
                  <path d="M12 2v4" />
                </svg>
              }
            </button>
          }
        </div>
      }
    </section>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PdpGalleryComponent {
  readonly images = input<string[]>([]);
  readonly productName = input<string>('');
  readonly brand = input<string | undefined>(undefined);
  readonly category = input<string | undefined>(undefined);
  readonly sku = input<string | undefined>(undefined);

  protected readonly selectedImageIndex = signal<number>(0);
  protected readonly failedImages = signal<Record<number, boolean>>({});

  protected readonly activeImage = computed(() => {
    const list = this.images();
    const idx = this.selectedImageIndex();
    if (list.length === 0) return '';
    return list[idx] !== undefined ? list[idx] : list[0];
  });

  protected readonly hasMultipleImages = computed(() => this.images().length > 1);

  protected readonly isCurrentImageValid = computed(() => {
    const img = this.activeImage();
    const idx = this.selectedImageIndex();
    return Boolean(img) && !this.failedImages()[idx];
  });

  protected isThumbnailFailed(index: number): boolean {
    return Boolean(this.failedImages()[index]);
  }

  selectImage(index: number): void {
    if (index >= 0 && index < this.images().length) {
      this.selectedImageIndex.set(index);
    }
  }

  previousImage(): void {
    const total = this.images().length;
    if (total <= 1) return;
    this.selectedImageIndex.update((curr) => (curr === 0 ? total - 1 : curr - 1));
  }

  nextImage(): void {
    const total = this.images().length;
    if (total <= 1) return;
    this.selectedImageIndex.update((curr) => (curr === total - 1 ? 0 : curr + 1));
  }

  handleImageError(index: number): void {
    this.failedImages.update((current) => ({ ...current, [index]: true }));
  }
}
