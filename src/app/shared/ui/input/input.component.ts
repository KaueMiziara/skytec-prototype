import {
  ChangeDetectionStrategy,
  Component,
  computed,
  forwardRef,
  input,
  output,
  signal
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

export type InputType =
  | 'text'
  | 'email'
  | 'password'
  | 'number'
  | 'tel'
  | 'search'
  | 'url';

export type LabelType = 'standard' | 'floating';

@Component({
  selector: 'app-input',
  template: `
    <div class="w-full flex flex-col gap-1.5" [class]="containerClass()">
      @if (label() && labelType() === 'standard') {
        <label
          [attr.for]="inputId()"
          class="text-xs font-semibold uppercase tracking-wider text-neutral-800"
        >
          {{ label() }}
          @if (required()) {
            <span class="text-red-600 ml-0.5" aria-hidden="true">*</span>
          }
        </label>
      }

      <div class="relative w-full">
        <input
          [id]="inputId()"
          [name]="name() || inputId()"
          [type]="type()"
          [value]="internalValue()"
          [placeholder]="labelType() === 'floating' ? ' ' : placeholder()"
          [disabled]="isDisabled()"
          [required]="required()"
          [attr.autocomplete]="autocomplete()"
          [attr.aria-invalid]="!!error()"
          [attr.aria-describedby]="describedBy()"
          (input)="handleInput($event)"
          (blur)="handleBlur($event)"
          (focus)="handleFocus($event)"
          [class]="inputClasses()"
        />

        @if (label() && labelType() === 'floating') {
          <label
            [attr.for]="inputId()"
            class="absolute text-sm text-neutral-500 duration-150 transform -translate-y-3.5 scale-75 top-3.5 z-10 origin-[0] left-3.5 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-3.5 peer-focus:text-[#077fbd] bg-white px-1 pointer-events-none"
          >
            {{ label() }}
            @if (required()) {
              <span class="text-red-600 ml-0.5" aria-hidden="true">*</span>
            }
          </label>
        }
      </div>

      @if (error()) {
        <p [id]="errorId()" class="text-xs font-medium text-red-600 mt-0.5">
          {{ error() }}
        </p>
      } @else if (hint()) {
        <p [id]="hintId()" class="text-xs text-neutral-500 mt-0.5">
          {{ hint() }}
        </p>
      }
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => InputComponent),
      multi: true
    }
  ]
})
export class InputComponent implements ControlValueAccessor {
  readonly id = input<string>('');
  readonly name = input<string>('');
  readonly label = input<string>('');
  readonly labelType = input<LabelType>('standard');
  readonly type = input<InputType>('text');
  readonly placeholder = input<string>('');
  readonly required = input<boolean>(false);
  readonly disabled = input<boolean>(false);
  readonly error = input<string | null | undefined>(null);
  readonly hint = input<string | null | undefined>(null);
  readonly autocomplete = input<string>('off');
  readonly containerClass = input<string>('');
  readonly customClass = input<string>('');

  readonly valueChange = output<string>();
  readonly inputBlur = output<FocusEvent>();
  readonly inputFocus = output<FocusEvent>();

  protected readonly internalValue = signal<string>('');
  protected readonly isInternalDisabled = signal<boolean>(false);

  private readonly generatedId = `skytec-input-${Math.random().toString(36).substring(2, 9)}`;

  protected readonly inputId = computed(() => this.id() || this.generatedId);
  protected readonly errorId = computed(() => `${this.inputId()}-error`);
  protected readonly hintId = computed(() => `${this.inputId()}-hint`);

  protected readonly describedBy = computed(() => {
    if (this.error()) return this.errorId();
    if (this.hint()) return this.hintId();
    return null;
  });

  protected readonly isDisabled = computed(() => this.disabled() || this.isInternalDisabled());

  protected readonly inputClasses = computed(() => {
    const base =
      'peer w-full px-3.5 py-2.5 text-sm bg-white text-neutral-900 border rounded-md transition-all placeholder:text-neutral-400 focus:outline-none focus:ring-2 disabled:bg-neutral-100 disabled:text-neutral-400 disabled:cursor-not-allowed';

    const state = this.error()
      ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20'
      : 'border-neutral-300 hover:border-neutral-400 focus:border-[#077fbd] focus:ring-[#077fbd]/20';

    return `${base} ${state} ${this.customClass()}`.trim();
  });

  private onChange: (value: string) => void = () => {};
  private onTouched: () => void = () => {};

  writeValue(value: unknown): void {
    const stringVal = value === null || value === undefined ? '' : String(value);
    this.internalValue.set(stringVal);
  }

  registerOnChange(fn: (value: string) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.isInternalDisabled.set(isDisabled);
  }

  protected handleInput(event: Event): void {
    const target = event.target as HTMLInputElement;
    const value = target.value;
    this.internalValue.set(value);
    this.onChange(value);
    this.valueChange.emit(value);
  }

  protected handleBlur(event: FocusEvent): void {
    this.onTouched();
    this.inputBlur.emit(event);
  }

  protected handleFocus(event: FocusEvent): void {
    this.inputFocus.emit(event);
  }
}
