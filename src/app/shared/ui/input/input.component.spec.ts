import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { Component, signal } from '@angular/core';
import { InputComponent, LabelType } from './input.component';

@Component({
  imports: [InputComponent, ReactiveFormsModule],
  template: `
    <app-input
      [formControl]="control"
      [label]="label()"
      [labelType]="labelType()"
      [error]="errorMsg()"
      [hint]="hintMsg()"
    />
  `
})
class TestHostComponent {
  readonly control = new FormControl('Máquina Reta');
  readonly label = signal('Nome Completo');
  readonly labelType = signal<LabelType>('standard');
  readonly errorMsg = signal<string | null>(null);
  readonly hintMsg = signal<string | null>(null);
}

describe('InputComponent', () => {
  let fixture: ComponentFixture<TestHostComponent>;
  let hostComponent: TestHostComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestHostComponent, InputComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(TestHostComponent);
    hostComponent = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create and bind initial form control value', () => {
    const inputElement = fixture.nativeElement.querySelector('input') as HTMLInputElement;
    expect(inputElement.value).toBe('Máquina Reta');
  });

  it('should update form control when input value changes', () => {
    const inputElement = fixture.nativeElement.querySelector('input') as HTMLInputElement;
    inputElement.value = 'Overlock Sun Special';
    inputElement.dispatchEvent(new Event('input'));
    fixture.detectChanges();

    expect(hostComponent.control.value).toBe('Overlock Sun Special');
  });

  it('should display error message when error is provided', () => {
    hostComponent.errorMsg.set('Campo obrigatório');
    fixture.detectChanges();

    const errorParagraph = fixture.nativeElement.querySelector('p');
    expect(errorParagraph.textContent.trim()).toBe('Campo obrigatório');
  });

  it('should display hint message when hint is provided and no error', () => {
    hostComponent.hintMsg.set('Informe seu nome completo');
    fixture.detectChanges();

    const hintParagraph = fixture.nativeElement.querySelector('p');
    expect(hintParagraph.textContent.trim()).toBe('Informe seu nome completo');
  });

  it('should disable native input when form control is disabled', () => {
    hostComponent.control.disable();
    fixture.detectChanges();

    const inputElement = fixture.nativeElement.querySelector('input') as HTMLInputElement;
    expect(inputElement.disabled).toBe(true);
  });

  it('should render floating label when labelType is floating', () => {
    hostComponent.labelType.set('floating');
    fixture.detectChanges();

    const labelElement = fixture.nativeElement.querySelector('label') as HTMLLabelElement;
    expect(labelElement.className).toContain('absolute');
  });
});
