import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { HeroComponent } from './hero.component';
import { CartService } from '../../../../core/services/cart.service';

describe('HeroComponent', () => {
  let component: HeroComponent;
  let fixture: ComponentFixture<HeroComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HeroComponent],
      providers: [provideRouter([]), CartService]
    }).compileComponents();

    fixture = TestBed.createComponent(HeroComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render official H1 and H2 copy', () => {
    const h1 = fixture.nativeElement.querySelector('h1') as HTMLHeadingElement;
    const h2 = fixture.nativeElement.querySelector('h2') as HTMLHeadingElement;

    expect(h1).toBeTruthy();
    expect(h1.textContent?.trim()).toBe(
      'Invista em produtividade: sua confecção merece a máquina certa para crescer!'
    );

    expect(h2).toBeTruthy();
    expect(h2.textContent?.trim()).toBe(
      'Tecnologia que transforma costura em resultado. Garanta já a sua máquina.'
    );
  });

  it('should render primary CTA directing to catalog', () => {
    const catalogLink = fixture.nativeElement.querySelector('a[routerLink="/catalogo"]') as HTMLAnchorElement;
    expect(catalogLink).toBeTruthy();
    expect(catalogLink.textContent).toContain('Ver Catálogo Completo');
  });

  it('should render WhatsApp consultation CTA link', () => {
    const whatsappLink = fixture.nativeElement.querySelector('a[href*="wa.me"]') as HTMLAnchorElement;
    expect(whatsappLink).toBeTruthy();
    expect(whatsappLink.textContent).toContain('Consultor WhatsApp');
  });
});
