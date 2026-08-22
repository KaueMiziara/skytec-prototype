import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { RouterLink } from '@angular/router';
import { CartService } from '../../../../core/services/cart.service';

export interface MediaItem {
  id: string;
  title: string;
  category: string;
  duration: string;
  speed: string;
  description: string;
  productId: string;
  videoUrl: string;
}

@Component({
  selector: 'app-media-section',
  imports: [RouterLink],
  template: `
    <section class="py-12 sm:py-16 lg:py-20 bg-[#101010] text-white border-b border-neutral-800">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex flex-col md:flex-row md:items-end justify-between mb-8 sm:mb-12 gap-4">
          <div>
            <div class="inline-flex items-center gap-2 px-2.5 py-1 rounded bg-[#0573cc]/15 text-[#0573cc] text-xs font-bold uppercase tracking-wider mb-2 border border-[#0573cc]/30">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-3.5 h-3.5" aria-hidden="true">
                <polygon points="5 3 19 12 5 21 5 3" />
              </svg>
              Demonstração Técnica em Vídeo
            </div>
            <h2 class="text-xl sm:text-2xl lg:text-3xl font-black text-white tracking-tight">
              Maquinário em Ação nas Confecções
            </h2>
            <p class="text-xs sm:text-sm text-neutral-400 mt-1">
              Confira a precisão, velocidade de costura e o nível de automação dos equipamentos SKYTEC.
            </p>
          </div>

          <a
            [href]="cartService.generateWhatsAppLink()"
            target="_blank"
            rel="noopener noreferrer"
            class="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-neutral-900 hover:bg-neutral-800 border border-neutral-700 text-neutral-200 hover:text-white text-xs font-bold uppercase tracking-wider transition-colors self-start md:self-auto focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#25D366]"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-4 h-4 text-[#25D366]"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
            <span>Dúvida Técnica via WhatsApp</span>
          </a>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
          <div class="lg:col-span-8 bg-neutral-900 border border-neutral-800 rounded-2xl overflow-hidden shadow-2xl">
            <div class="relative aspect-video bg-neutral-950 flex items-center justify-center border-b border-neutral-800">
              @if (activeEmbedUrl(); as embedUrl) {
                <iframe
                  class="w-full h-full border-0"
                  [src]="embedUrl"
                  [title]="activeVideo()?.title ?? 'Demonstração Técnica em Vídeo'"
                  loading="lazy"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowfullscreen
                ></iframe>
              }
            </div>

            <div class="p-6 sm:p-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div class="space-y-1">
                <div class="flex items-center gap-2">
                  <span class="px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase tracking-wider bg-[#0573cc] text-white">
                    {{ activeVideo()?.category }}
                  </span>
                  <span class="text-xs font-mono text-neutral-400">
                    {{ activeVideo()?.speed }} &bull; Duração: {{ activeVideo()?.duration }}
                  </span>
                </div>
                <h3 class="text-base sm:text-lg font-bold text-white">
                  {{ activeVideo()?.title }}
                </h3>
                <p class="text-xs text-neutral-400 max-w-xl">
                  {{ activeVideo()?.description }}
                </p>
              </div>

              <a
                [routerLink]="['/produto', activeVideo()?.productId]"
                class="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg bg-[#077fbd] hover:bg-[#066a9e] text-white text-xs font-bold uppercase tracking-wider transition-colors shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#077fbd]"
              >
                <span>Ver Máquina</span>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-3.5 h-3.5"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
              </a>
            </div>
          </div>

          <div class="lg:col-span-4 space-y-3" role="list" aria-label="Vídeos de demonstração">
            @for (item of mediaList; track item.id) {
              <button
                type="button"
                (click)="selectVideo(item)"
                class="w-full text-left p-4 rounded-xl border transition-all duration-150 cursor-pointer flex items-start gap-3.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0573cc]"
                [class]="activeVideo()?.id === item.id ? 'bg-neutral-900 border-[#0573cc] text-white' : 'bg-neutral-900/60 border-neutral-800 text-neutral-300 hover:bg-neutral-900 hover:border-neutral-700'"
                role="listitem"
                [attr.aria-selected]="activeVideo()?.id === item.id"
              >
                <div class="w-10 h-10 rounded-lg bg-neutral-950 border border-neutral-800 flex items-center justify-center text-[#0573cc] shrink-0 mt-0.5">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-5 h-5"><polygon points="5 3 19 12 5 21 5 3"/></svg>
                </div>

                <div class="flex-1 min-w-0 space-y-1">
                  <div class="flex items-center justify-between">
                    <span class="text-[10px] font-mono font-bold uppercase tracking-wider text-[#0573cc]">
                      {{ item.category }}
                    </span>
                    <span class="text-[11px] font-mono text-neutral-500">
                      {{ item.duration }}
                    </span>
                  </div>

                  <h4 class="text-xs sm:text-sm font-bold text-white truncate">
                    {{ item.title }}
                  </h4>

                  <p class="text-[11px] text-neutral-400 line-clamp-1">
                    {{ item.description }}
                  </p>
                </div>
              </button>
            }
          </div>
        </div>
      </div>
    </section>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MediaSectionComponent {
  readonly cartService = inject(CartService);
  private readonly sanitizer = inject(DomSanitizer);

  readonly mediaList: MediaItem[] = [
    {
      id: 'media-skymak-r8',
      title: 'SKYMAK R8: Teste de Corte Automático & Alta Velocidade',
      category: 'Reta Eletrônica',
      duration: '02:45',
      speed: '5.000 RPM',
      description: 'Demonstração de precisão no arremate inicial/final e eficiência energética do motor Direct Drive.',
      productId: 'PROD-SKYMAK-R8',
      videoUrl: 'https://youtu.be/JA6ocV5kqaE'
    },
    {
      id: 'media-sun-ss65d',
      title: 'Sun Special SS65D: Fechamento Limpo em Malhas e Moletom',
      category: 'Overlock Direct Drive',
      duration: '01:50',
      speed: '6.000 RPM',
      description: 'Operação suave sem vibração com lubrificação automática em tecidos elásticos.',
      productId: 'PROD-SUN-SS65D',
      videoUrl: 'https://youtu.be/JA6ocV5kqaE'
    },
    {
      id: 'media-siruba-747k',
      title: 'Siruba 747K: Costura Contínua 4 Fios em Alta Cadência',
      category: 'Overlock 4 Fios',
      duration: '02:10',
      speed: '6.500 RPM',
      description: 'Acabamento profissional de alta resistência com controle eletrônico integrado.',
      productId: 'PROD-SIRUBA-747K',
      videoUrl: 'https://youtu.be/JA6ocV5kqaE'
    }
  ];

  readonly activeVideo = signal<MediaItem | null>(this.mediaList[0]);

  readonly activeEmbedUrl = computed<SafeResourceUrl | null>(() => {
    const current = this.activeVideo();
    if (!current?.videoUrl) {
      return null;
    }
    const videoId = this.extractYouTubeId(current.videoUrl);
    if (!videoId) {
      return null;
    }
    return this.sanitizer.bypassSecurityTrustResourceUrl(`https://www.youtube-nocookie.com/embed/${videoId}`);
  });

  selectVideo(item: MediaItem): void {
    this.activeVideo.set(item);
  }

  private extractYouTubeId(url: string): string {
    if (!url) {
      return '';
    }
    const trimmed = url.trim();
    const regExp = /(?:youtu\.be\/|youtube(?:-nocookie)?\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([\w-]{11})/;
    const match = trimmed.match(regExp);
    if (match && match[1]) {
      return match[1];
    }
    if (/^[\w-]{11}$/.test(trimmed)) {
      return trimmed;
    }
    return '';
  }
}
