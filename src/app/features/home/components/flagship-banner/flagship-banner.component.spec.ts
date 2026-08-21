import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { FlagshipBannerComponent } from './flagship-banner.component';
import { CartService } from '../../../../core/services/cart.service';
import { ProductService } from '../../../../core/services/product.service';

describe('FlagshipBannerComponent', () => {
  let component: FlagshipBannerComponent;
  let fixture: ComponentFixture<FlagshipBannerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FlagshipBannerComponent],
      providers: [provideRouter([]), CartService, ProductService]
    }).compileComponents();

    fixture = TestBed.createComponent(FlagshipBannerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render official tag', () => {
    const text = fixture.nativeElement.textContent;
    expect(text).toContain('Referência em máquinas de costura no Brasil');
  });

  it('should render official H3 title', () => {
    const h3 = fixture.nativeElement.querySelector('h3') as HTMLHeadingElement;
    expect(h3).toBeTruthy();
    expect(h3.textContent?.trim()).toBe(
      'Máquina de Costura Industrial Reta Eletrônica Direct Drive SKYMAK R8'
    );
  });

  it('should render official supporting copy', () => {
    const text = fixture.nativeElement.textContent;
    expect(text).toContain(
      'Alta tecnologia e precisão para elevar o nível da sua produção.'
    );
  });

  it('should render WhatsApp CTA button with official text', () => {
    const whatsappBtn = fixture.nativeElement.querySelector('a[href*="wa.me"]') as HTMLAnchorElement;
    expect(whatsappBtn).toBeTruthy();
    expect(whatsappBtn.textContent).toContain('CONSULTAR UM VENDEDOR');
  });

  it('should render product link for technical specifications', () => {
    const productLink = fixture.nativeElement.querySelector('a[routerLink*="PROD-SKYMAK-R8"]') as HTMLAnchorElement;
    expect(productLink).toBeTruthy();
    expect(productLink.textContent).toContain('Ver Ficha Técnica');
  });
});
