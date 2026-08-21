import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { AboutComponent } from './about.component';

describe('AboutComponent', () => {
  let component: AboutComponent;
  let fixture: ComponentFixture<AboutComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AboutComponent],
      providers: [provideRouter([])]
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

  it('should constrain the content area within a max-w-prose container', () => {
    const proseContainer = fixture.nativeElement.querySelector('section.max-w-prose');
    expect(proseContainer).toBeTruthy();
  });
});
