import { TestBed } from '@angular/core/testing';
import { Router, provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { HomeComponent } from './features/home/home.component';
import { CatalogComponent } from './features/catalog/catalog.component';
import { ProductDetailComponent } from './features/catalog/pages/product-detail/product-detail.component';
import { AboutComponent } from './features/about/about.component';
import { AuthComponent } from './features/auth/auth.component';
import { AdminComponent } from './features/admin/admin.component';

describe('App Routes', () => {
  let router: Router;

  beforeEach(async () => {
    TestBed.configureTestingModule({
      providers: [provideRouter(routes)]
    });
    router = TestBed.inject(Router);
    router.initialNavigation();
  });

  it('should navigate to home on empty path', async () => {
    const success = await router.navigateByUrl('/');
    expect(success).toBe(true);
    expect(router.url).toBe('/');
  });

  it('should navigate to catalogo', async () => {
    const success = await router.navigateByUrl('/catalogo');
    expect(success).toBe(true);
    expect(router.url).toBe('/catalogo');
  });

  it('should navigate to product detail with id parameter', async () => {
    const success = await router.navigateByUrl('/produto/PROD-1');
    expect(success).toBe(true);
    expect(router.url).toBe('/produto/PROD-1');
  });

  it('should navigate to sobre-nos', async () => {
    const success = await router.navigateByUrl('/sobre-nos');
    expect(success).toBe(true);
    expect(router.url).toBe('/sobre-nos');
  });

  it('should navigate to conta', async () => {
    const success = await router.navigateByUrl('/conta');
    expect(success).toBe(true);
    expect(router.url).toBe('/conta');
  });

  it('should navigate to admin', async () => {
    const success = await router.navigateByUrl('/admin');
    expect(success).toBe(true);
    expect(router.url).toBe('/admin');
  });

  it('should redirect unknown routes to home', async () => {
    const success = await router.navigateByUrl('/unknown-route');
    expect(success).toBe(true);
    expect(router.url).toBe('/');
  });
});
