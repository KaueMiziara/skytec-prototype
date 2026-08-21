import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./features/home/home.component').then((m) => m.HomeComponent)
  },
  {
    path: 'catalogo',
    loadComponent: () => import('./features/catalog/catalog.component').then((m) => m.CatalogComponent)
  },
  {
    path: 'produto/:id',
    loadComponent: () =>
      import('./features/catalog/pages/product-detail/product-detail.component').then(
        (m) => m.ProductDetailComponent
      )
  },
  {
    path: 'sobre-nos',
    loadComponent: () => import('./features/about/about.component').then((m) => m.AboutComponent)
  },
  {
    path: 'conta',
    loadComponent: () => import('./features/auth/auth.component').then((m) => m.AuthComponent)
  },
  {
    path: 'admin',
    loadComponent: () => import('./features/admin/admin.component').then((m) => m.AdminComponent)
  },
  {
    path: '**',
    redirectTo: '',
    pathMatch: 'full'
  }
];
