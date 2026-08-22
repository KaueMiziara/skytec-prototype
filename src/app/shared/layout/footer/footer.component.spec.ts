import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { FooterComponent } from './footer.component';

describe('FooterComponent', () => {
  let component: FooterComponent;
  let fixture: ComponentFixture<FooterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FooterComponent],
      providers: [provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(FooterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display company CNPJ and legal details', () => {
    const text = fixture.nativeElement.textContent;
    expect(text).toContain('CNPJ: 12.345.678/0001-90');
    expect(text).toContain('São Mateus');
  });

  it('should render the required developer signature', () => {
    const text = fixture.nativeElement.textContent;
    expect(text).toContain('⟨ Computational Physics | Kaue Miziara | Software Engineering ⟩');
  });
});
