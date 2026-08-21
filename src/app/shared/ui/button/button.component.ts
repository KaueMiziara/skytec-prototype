import { ChangeDetectionStrategy, Component, computed, input, output } from '@angular/core';

export type ButtonVariant = 'primary' | 'dark' | 'outline' | 'ghost' | 'whatsapp' | 'danger';
export type ButtonSize = 'sm' | 'md' | 'lg';

@Component({
  selector: 'app-button',
  template: `
    <button
      [type]="type()"
      [disabled]="disabled()"
      [attr.aria-label]="ariaLabel() || null"
      (click)="handleClick($event)"
      [class]="buttonClasses()"
    >
      <ng-content />
    </button>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[class.w-full]': 'fullWidth()',
    '[class.inline-block]': '!fullWidth()'
  }
})
export class ButtonComponent {
  readonly variant = input<ButtonVariant>('primary');
  readonly size = input<ButtonSize>('md');
  readonly type = input<'button' | 'submit' | 'reset'>('button');
  readonly disabled = input<boolean>(false);
  readonly fullWidth = input<boolean>(false);
  readonly ariaLabel = input<string | undefined>(undefined);
  readonly customClass = input<string>('');

  readonly clicked = output<MouseEvent>();

  protected readonly buttonClasses = computed(() => {
    const base =
      'inline-flex items-center justify-center font-medium transition-colors cursor-pointer disabled:cursor-not-allowed disabled:opacity-50 select-none focus-visible:outline-none';

    const variants: Record<ButtonVariant, string> = {
      primary:
        'bg-[#077fbd] hover:bg-[#066a9e] active:bg-[#055780] text-white focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#077fbd]',
      dark:
        'bg-[#101010] hover:bg-[#252525] active:bg-black text-white focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#101010]',
      outline:
        'bg-transparent border border-neutral-300 hover:bg-neutral-100 active:bg-neutral-200 text-neutral-800 focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#077fbd]',
      ghost:
        'bg-transparent hover:bg-neutral-200/70 active:bg-neutral-300 text-neutral-700 focus-visible:ring-2 focus-visible:ring-[#077fbd]',
      whatsapp:
        'bg-[#25D366] hover:bg-[#20ba59] active:bg-[#1da850] text-white font-semibold focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#25D366]',
      danger:
        'bg-red-600 hover:bg-red-700 active:bg-red-800 text-white focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-red-600'
    };

    const sizes: Record<ButtonSize, string> = {
      sm: 'text-xs px-3 py-1.5 rounded gap-1.5',
      md: 'text-sm px-4 py-2.5 rounded-md gap-2',
      lg: 'text-base px-6 py-3.5 rounded-lg font-semibold gap-2.5'
    };

    const width = this.fullWidth() ? 'w-full' : '';

    return `${base} ${variants[this.variant()]} ${sizes[this.size()]} ${width} ${this.customClass()}`.trim();
  });

  protected handleClick(event: MouseEvent): void {
    if (this.disabled()) {
      event.preventDefault();
      event.stopPropagation();
      return;
    }
    this.clicked.emit(event);
  }
}
