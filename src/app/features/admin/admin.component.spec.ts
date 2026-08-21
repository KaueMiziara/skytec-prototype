import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { AdminComponent } from './admin.component';
import { AuthService } from '../../core/services/auth.service';
import { ProductService } from '../../core/services/product.service';

describe('AdminComponent', () => {
  let component: AdminComponent;
  let fixture: ComponentFixture<AdminComponent>;
  let productService: ProductService;
  let authService: AuthService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminComponent],
      providers: [provideRouter([]), ProductService, AuthService]
    }).compileComponents();

    fixture = TestBed.createComponent(AdminComponent);
    component = fixture.componentInstance;
    productService = TestBed.inject(ProductService);
    authService = TestBed.inject(AuthService);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render the dark #101010 sidebar navigation', () => {
    const sidebar = fixture.nativeElement.querySelector('aside#admin-sidebar');
    expect(sidebar).toBeTruthy();
    expect(sidebar.classList.contains('bg-[#101010]')).toBe(true);
  });

  it('should render all 4 admin navigation buttons with proper labels', () => {
    const nav = fixture.nativeElement.querySelector('nav[aria-label="Menu Administrativo"]');
    expect(nav).toBeTruthy();

    const buttons = nav.querySelectorAll('button');
    expect(buttons.length).toBe(4);

    const buttonTexts = Array.from(buttons).map((btn: any) => btn.textContent.trim());
    expect(buttonTexts[0]).toContain('Produtos');
    expect(buttonTexts[1]).toContain('Pedidos & Cotações');
    expect(buttonTexts[2]).toContain('Clientes');
    expect(buttonTexts[3]).toContain('Configurações');
  });

  it('should have products tab selected by default with aria-current="page"', () => {
    expect(component.activeTab()).toBe('products');

    const productsButton = fixture.nativeElement.querySelector('nav[aria-label="Menu Administrativo"] button:nth-child(1)');
    expect(productsButton.getAttribute('aria-current')).toBe('page');
    expect(productsButton.classList.contains('bg-[#077fbd]')).toBe(true);

    const heading = fixture.nativeElement.querySelector('h1');
    expect(heading.textContent).toContain('Gerenciamento de Produtos');
  });

  it('should switch active tab when navigation buttons are clicked', () => {
    const navButtons = fixture.nativeElement.querySelectorAll('nav[aria-label="Menu Administrativo"] button');

    navButtons[1].click();
    fixture.detectChanges();
    expect(component.activeTab()).toBe('orders');
    expect(fixture.nativeElement.querySelector('h1').textContent).toContain('Pedidos & Cotações');
    expect(navButtons[1].getAttribute('aria-current')).toBe('page');

    navButtons[2].click();
    fixture.detectChanges();
    expect(component.activeTab()).toBe('customers');
    expect(fixture.nativeElement.querySelector('h1').textContent).toContain('Clientes Cadastrados');
    expect(navButtons[2].getAttribute('aria-current')).toBe('page');

    navButtons[3].click();
    fixture.detectChanges();
    expect(component.activeTab()).toBe('settings');
    expect(fixture.nativeElement.querySelector('h1').textContent).toContain('Configurações do Sistema');
    expect(navButtons[3].getAttribute('aria-current')).toBe('page');

    navButtons[0].click();
    fixture.detectChanges();
    expect(component.activeTab()).toBe('products');
    expect(fixture.nativeElement.querySelector('h1').textContent).toContain('Gerenciamento de Produtos');
  });

  it('should render structural breadcrumb navigation', () => {
    const breadcrumb = fixture.nativeElement.querySelector('nav[aria-label="Navegação Estrutural"]');
    expect(breadcrumb).toBeTruthy();

    const homeLink = breadcrumb.querySelector('a[routerLink="/"]');
    expect(homeLink).toBeTruthy();
    expect(homeLink.textContent.trim()).toBe('Início');

    const currentSection = breadcrumb.querySelector('[aria-current="page"]');
    expect(currentSection.textContent.trim()).toBe('Gerenciamento de Produtos');
  });

  it('should display catalog metrics and brand counts accurately', () => {
    const productsCount = productService.products().length;
    const brandsCount = productService.brands().length;

    const text = fixture.nativeElement.textContent;
    expect(text).toContain(`${productsCount} máquinas`);
    expect(text).toContain(`${brandsCount} ativas`);
  });

  it('should toggle mobile sidebar visibility', () => {
    expect(component.isMobileSidebarOpen()).toBe(false);

    component.toggleMobileSidebar();
    expect(component.isMobileSidebarOpen()).toBe(true);

    component.closeMobileSidebar();
    expect(component.isMobileSidebarOpen()).toBe(false);
  });

  it('should close mobile sidebar on Escape keydown', () => {
    component.toggleMobileSidebar();
    expect(component.isMobileSidebarOpen()).toBe(true);

    const event = new KeyboardEvent('keydown', { key: 'Escape' });
    document.dispatchEvent(event);
    expect(component.isMobileSidebarOpen()).toBe(false);
  });

  it('should display admin user info and back to store link in sidebar footer', () => {
    const sidebar = fixture.nativeElement.querySelector('aside#admin-sidebar');
    const backToStoreLink = sidebar.querySelector('a[routerLink="/"]');
    expect(backToStoreLink).toBeTruthy();
    expect(backToStoreLink.textContent).toContain('Voltar para a Loja');
  });

  it('should render admin product table when products tab is active', () => {
    const productTable = fixture.nativeElement.querySelector('app-admin-product-table');
    expect(productTable).toBeTruthy();
  });

  it('should call deleteProduct on ProductService when handleDeleteProduct is invoked', () => {
    const initialCount = productService.products().length;
    const firstProduct = productService.products()[0];

    component.handleDeleteProduct(firstProduct.id);
    fixture.detectChanges();

    expect(productService.products().length).toBe(initialCount - 1);
    expect(productService.getProductById(firstProduct.id)).toBeUndefined();
  });

  it('should open modal for new product when handleCreateProduct is called', () => {
    component.handleCreateProduct();
    expect(component.isProductModalOpen()).toBe(true);
    expect(component.selectedProductForEdit()).toBeNull();
  });

  it('should open modal for editing when handleEditProduct is called', () => {
    const firstProduct = productService.products()[0];
    component.handleEditProduct(firstProduct);
    expect(component.isProductModalOpen()).toBe(true);
    expect(component.selectedProductForEdit()).toBe(firstProduct);
  });

  it('should add product to ProductService on handleSaveProduct in create mode', () => {
    const initialCount = productService.products().length;
    component.handleCreateProduct();

    const newProduct = {
      id: 'prod-new-test',
      sku: 'SKU-NEW-01',
      name: 'Máquina Nova Teste',
      brand: 'SKYMAK',
      category: 'Reta',
      price: 3800,
      images: ['/img.jpg'],
      shortDescription: 'Descrição teste',
      differentials: ['D1'],
      specifications: { 'Velocidade': '5000' }
    };

    component.handleSaveProduct(newProduct);
    expect(productService.products().length).toBe(initialCount + 1);
    expect(productService.getProductById('prod-new-test')).toBeDefined();
    expect(component.isProductModalOpen()).toBe(false);
  });

  it('should update product in ProductService on handleSaveProduct in edit mode', () => {
    const firstProduct = productService.products()[0];
    component.handleEditProduct(firstProduct);

    const updatedProduct = {
      ...firstProduct,
      name: 'Nome Atualizado do Produto',
      price: 9999
    };

    component.handleSaveProduct(updatedProduct);
    const retrieved = productService.getProductById(firstProduct.id);
    expect(retrieved?.name).toBe('Nome Atualizado do Produto');
    expect(retrieved?.price).toBe(9999);
    expect(component.isProductModalOpen()).toBe(false);
  });

  it('should close modal on handleCancelProductModal', () => {
    component.handleCreateProduct();
    expect(component.isProductModalOpen()).toBe(true);

    component.handleCancelProductModal();
    expect(component.isProductModalOpen()).toBe(false);
    expect(component.selectedProductForEdit()).toBeNull();
  });
});
