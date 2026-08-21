import { TestBed } from '@angular/core/testing';
import { provideRouter, Router, NavigationEnd } from '@angular/router';
import { Subject } from 'rxjs';
import { App } from './app';
import { routes } from './app.routes';
import { ProductService } from './core/services/product.service';
import { CartService } from './core/services/cart.service';

describe('App', () => {
  let router: Router;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [App],
      providers: [provideRouter(routes), ProductService, CartService]
    }).compileComponents();

    router = TestBed.inject(Router);
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(App);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it('should render header, main container with router outlet, footer, and cart drawer', () => {
    const fixture = TestBed.createComponent(App);
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('a[href="#main-content"]')).not.toBeNull();
    expect(compiled.querySelector('app-header')).not.toBeNull();
    expect(compiled.querySelector('main#main-content')).not.toBeNull();
    expect(compiled.querySelector('app-footer')).not.toBeNull();
    expect(compiled.querySelector('app-cart-drawer')).not.toBeNull();
  });

  it('should scroll to top on NavigationEnd event', () => {
    const scrollToSpy = vi.spyOn(window, 'scrollTo').mockImplementation(() => {});
    const fixture = TestBed.createComponent(App);
    fixture.detectChanges();

    (router.events as unknown as Subject<any>).next(new NavigationEnd(1, '/catalogo', '/catalogo'));

    expect(scrollToSpy).toHaveBeenCalledWith({ top: 0, left: 0, behavior: 'instant' });
    scrollToSpy.mockRestore();
  });
});
