import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

export type BadgeVariant = 'default' | 'brand' | 'dark' | 'success' | 'warning' | 'outline';
export type BadgeSize = 'sm' | 'md';

@Component({
  selector: 'app-badge',
  template: `
    <span [class]="badgeClasses()">
      <ng-content />
    </span>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'inline-flex items-center'
  }
})
export class BadgeComponent {
  readonly variant = input<BadgeVariant>('default');
  readonly size = input<BadgeSize>('md');
  readonly customClass = input<string>('');

  protected readonly badgeClasses = computed(() => {
    const base = 'inline-flex items-center justify-center font-medium tracking-wide transition-colors select-none';

    const variants: Record<BadgeVariant, string> = {
      default: 'bg-neutral-100 text-neutral-800 border border-neutral-200',
      brand: 'bg-[#0573cc]/10 text-[#0573cc] border border-[#0573cc]/30',
      dark: 'bg-[#101010] text-white border border-[#252525]',
      success: 'bg-emerald-50 text-emerald-700 border border-emerald-200',
      warning: 'bg-amber-50 text-amber-800 border border-amber-200',
      outline: 'bg-transparent text-neutral-700 border border-neutral-300'
    };

    const sizes: Record<BadgeSize, string> = {
      sm: 'text-[11px] px-2 py-0.5 rounded leading-tight',
      md: 'text-xs px-2.5 py-1 rounded-md leading-normal'
    };

    return `${base} ${variants[this.variant()]} ${sizes[this.size()]} ${this.customClass()}`.trim();
  });
}
