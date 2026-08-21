import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { App } from './app';
import { routes } from './app.routes';
import { ProductService } from './core/services/product.service';
import { CartService } from './core/services/cart.service';

describe('App', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [App],
      providers: [provideRouter(routes), ProductService, CartService]
    }).compileComponents();
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
});
