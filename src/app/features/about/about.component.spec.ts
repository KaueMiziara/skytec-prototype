import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { AboutComponent } from './about.component';
import { CartService } from '../../core/services/cart.service';

describe('AboutComponent', () => {
  let component: AboutComponent;
  let fixture: ComponentFixture<AboutComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AboutComponent],
      providers: [provideRouter([]), CartService]
    }).compileComponents();

    fixture = TestBed.createComponent(AboutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render breadcrumb navigation with home and about page links', () => {
    const nav = fixture.nativeElement.querySelector('nav[aria-label="Navegação Estrutural"]');
    expect(nav).toBeTruthy();

    const homeLink = nav.querySelector('a[routerLink="/"]');
    expect(homeLink).toBeTruthy();
    expect(homeLink.textContent.trim()).toBe('Início');

    const currentPage = nav.querySelector('[aria-current="page"]');
    expect(currentPage).toBeTruthy();
    expect(currentPage.textContent.trim()).toBe('Sobre Nós');
  });

  it('should render institutional header with H1 title', () => {
    const heading = fixture.nativeElement.querySelector('h1');
    expect(heading).toBeTruthy();
    expect(heading.textContent).toContain('Sobre a SKYTEC');
  });

  it('should render content area container', () => {
    const contentSection = fixture.nativeElement.querySelector('section[aria-label="Conteúdo Institucional"]');
    expect(contentSection).toBeTruthy();
  });

  it('should render Block 1: Sua Jornada na Costura Começa Aqui with side-by-side grid', () => {
    const text = fixture.nativeElement.textContent;
    expect(text).toContain('Sua Jornada na Costura Começa Aqui');
    expect(text).toContain('Seja você um profissional experiente ou iniciante');
    expect(text).toContain('desde pequenos ateliês até confecções de grande porte');
  });

  it('should render Block 2: Soluções Completas em Maquinário with catalog link', () => {
    const text = fixture.nativeElement.textContent;
    expect(text).toContain('Soluções Completas em Maquinário');
    expect(text).toContain('Nosso catálogo reúne máquinas domésticas e modelos industriais');
    expect(text).toContain('algodão, malha, moletom, jeans e materiais pesados');

    const catalogLink = fixture.nativeElement.querySelector('a[routerLink="/catalogo"]') as HTMLAnchorElement;
    expect(catalogLink).toBeTruthy();
    expect(catalogLink.textContent).toContain('Ver Catálogo de Máquinas');
  });

  it('should render Block 3: Linhas e Aviamentos', () => {
    const text = fixture.nativeElement.textContent;
    expect(text).toContain('Linhas e Aviamentos');
    expect(text).toContain('O bom acabamento depende dos insumos corretos');
    expect(text).toContain('linhas em diversas espessuras, botões, zíperes e elásticos');
  });

  it('should render Block 4: Por que escolher a SKYTEC with expanded black box and WhatsApp CTA link', () => {
    const text = fixture.nativeElement.textContent;
    expect(text).toContain('Por que escolher a SKYTEC?');
    expect(text).toContain('Trabalhamos para ser parceiros de longo prazo da sua empresa');
    expect(text).toContain('Atendimento Consultivo');
    expect(text).toContain('Logística Integrada');
    expect(text).toContain('Garantia & Reposição');
    expect(text).toContain('Faturamento Flexível');

    const whatsappCta = fixture.nativeElement.querySelector('a[href*="wa.me"]') as HTMLAnchorElement;
    expect(whatsappCta).toBeTruthy();
    expect(whatsappCta.textContent).toContain('Fale com um Consultor');
  });
});
