import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { InstitutionalSnippetComponent } from './institutional-snippet.component';
import { CartService } from '../../../../core/services/cart.service';

describe('InstitutionalSnippetComponent', () => {
  let component: InstitutionalSnippetComponent;
  let fixture: ComponentFixture<InstitutionalSnippetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InstitutionalSnippetComponent],
      providers: [provideRouter([]), CartService]
    }).compileComponents();

    fixture = TestBed.createComponent(InstitutionalSnippetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render official heading and intro text', () => {
    const heading = fixture.nativeElement.querySelector('h2');
    expect(heading.textContent).toContain('Sua Jornada na Costura Começa Aqui');

    const text = fixture.nativeElement.textContent;
    expect(text).toContain('Seja você um profissional experiente ou iniciante');
  });

  it('should render link to Sobre Nós page', () => {
    const aboutLink = fixture.nativeElement.querySelector('a[routerLink="/sobre-nos"]') as HTMLAnchorElement;
    expect(aboutLink).toBeTruthy();
    expect(aboutLink.textContent).toContain('Conhecer a Empresa');
  });

  it('should render WhatsApp consultation CTA link', () => {
    const whatsappLink = fixture.nativeElement.querySelector('a[href*="wa.me"]') as HTMLAnchorElement;
    expect(whatsappLink).toBeTruthy();
    expect(whatsappLink.textContent).toContain('Fale com um Consultor');
  });
});
