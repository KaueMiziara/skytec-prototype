import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BadgeComponent } from './badge.component';

describe('BadgeComponent', () => {
  let component: BadgeComponent;
  let fixture: ComponentFixture<BadgeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BadgeComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(BadgeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should apply default variant classes', () => {
    const span = fixture.nativeElement.querySelector('span') as HTMLSpanElement;
    expect(span.className).toContain('bg-neutral-100');
  });

  it('should apply brand variant classes when input changes', () => {
    fixture.componentRef.setInput('variant', 'brand');
    fixture.detectChanges();

    const span = fixture.nativeElement.querySelector('span') as HTMLSpanElement;
    expect(span.className).toContain('text-[#0573cc]');
  });

  it('should apply dark variant classes', () => {
    fixture.componentRef.setInput('variant', 'dark');
    fixture.detectChanges();

    const span = fixture.nativeElement.querySelector('span') as HTMLSpanElement;
    expect(span.className).toContain('bg-[#101010]');
  });
});
