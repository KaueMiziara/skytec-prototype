import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { AdminProductTableComponent } from './admin-product-table.component';
import { Product } from '../../../../core/models/product.model';

describe('AdminProductTableComponent', () => {
  let component: AdminProductTableComponent;
  let fixture: ComponentFixture<AdminProductTableComponent>;

  const mockProducts: Product[] = [
    {
      id: 'prod-1',
      sku: 'SKU-001',
      name: 'Alpha Reta Industrial Direct Drive',
      brand: 'Jack',
      category: 'Reta',
      price: 3500,
      images: ['alpha.jpg'],
      shortDescription: 'Máquina reta de alta performance',
      differentials: ['Direct Drive', 'Corte de Linha'],
      specifications: { 'Velocidade': '5000 rpm' },
      isFeatured: true
    },
    {
      id: 'prod-2',
      sku: 'SKU-002',
      name: 'Beta Overlock 4 Fios',
      brand: 'Siruba',
      category: 'Overlock',
      price: 4200,
      images: ['beta.jpg'],
      shortDescription: 'Overlock robusta para confecção',
      differentials: ['Lubrificação Automática'],
      specifications: { 'Velocidade': '6000 rpm' },
      isFeatured: false
    },
    {
      id: 'prod-3',
      sku: 'SKU-003',
      name: 'Gamma Galoneira Base Plana',
      brand: 'Sun Special',
      category: 'Galoneira',
      price: 5100,
      images: [],
      shortDescription: 'Galoneira industrial 3 agulhas',
      differentials: ['Motor Direct Drive Integrado'],
      specifications: { 'Velocidade': '4500 rpm' },
      isFeatured: false
    }
  ];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminProductTableComponent],
      providers: [provideRouter([])]
    }).compileComponents();

    fixture = TestBed.createComponent(AdminProductTableComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('products', mockProducts);
    fixture.componentRef.setInput('brands', ['Jack', 'Siruba', 'Sun Special']);
    fixture.componentRef.setInput('categories', ['Reta', 'Overlock', 'Galoneira']);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render all products in table rows', () => {
    const rows = fixture.nativeElement.querySelectorAll('tbody tr');
    expect(rows.length).toBe(3);

    const firstRowText = rows[0].textContent;
    expect(firstRowText).toContain('SKU-001');
    expect(firstRowText).toContain('Alpha Reta Industrial Direct Drive');
    expect(firstRowText).toContain('Jack');
    expect(firstRowText).toContain('Reta');
    expect(firstRowText).toContain('R$ 3.500,00');
    expect(firstRowText).toContain('Destaque');
  });

  it('should filter products when searching', () => {
    component.searchQuery.set('Overlock');
    fixture.detectChanges();

    const rows = fixture.nativeElement.querySelectorAll('tbody tr');
    expect(rows.length).toBe(1);
    expect(rows[0].textContent).toContain('Beta Overlock 4 Fios');
  });

  it('should clear search filter when clear button is clicked', () => {
    component.searchQuery.set('Alpha');
    fixture.detectChanges();

    const clearButton = fixture.nativeElement.querySelector('button[aria-label="Limpar busca"]');
    expect(clearButton).toBeTruthy();
    clearButton.click();
    fixture.detectChanges();

    expect(component.searchQuery()).toBe('');
    const rows = fixture.nativeElement.querySelectorAll('tbody tr');
    expect(rows.length).toBe(3);
  });

  it('should filter products by brand', () => {
    component.selectedBrand.set('Siruba');
    fixture.detectChanges();

    const rows = fixture.nativeElement.querySelectorAll('tbody tr');
    expect(rows.length).toBe(1);
    expect(rows[0].textContent).toContain('Beta Overlock 4 Fios');
  });

  it('should filter products by category', () => {
    component.selectedCategory.set('Galoneira');
    fixture.detectChanges();

    const rows = fixture.nativeElement.querySelectorAll('tbody tr');
    expect(rows.length).toBe(1);
    expect(rows[0].textContent).toContain('Gamma Galoneira Base Plana');
  });

  it('should sort products by SKU ascending and descending', () => {
    component.toggleSort('sku');
    fixture.detectChanges();
    expect(component.sortColumn()).toBe('sku');
    expect(component.sortDirection()).toBe('asc');
    expect(component.filteredProducts()[0].sku).toBe('SKU-001');

    component.toggleSort('sku');
    fixture.detectChanges();
    expect(component.sortDirection()).toBe('desc');
    expect(component.filteredProducts()[0].sku).toBe('SKU-003');
  });

  it('should sort products by price ascending and descending', () => {
    component.toggleSort('price');
    fixture.detectChanges();
    expect(component.sortColumn()).toBe('price');
    expect(component.sortDirection()).toBe('asc');
    expect(component.filteredProducts()[0].price).toBe(3500);

    component.toggleSort('price');
    fixture.detectChanges();
    expect(component.sortDirection()).toBe('desc');
    expect(component.filteredProducts()[0].price).toBe(5100);
  });

  it('should sort products by brand', () => {
    component.toggleSort('brand');
    fixture.detectChanges();
    expect(component.sortColumn()).toBe('brand');
    expect(component.filteredProducts()[0].brand).toBe('Jack');
  });

  it('should sort products by category', () => {
    component.toggleSort('category');
    fixture.detectChanges();
    expect(component.sortColumn()).toBe('category');
    expect(component.filteredProducts()[0].category).toBe('Galoneira');
  });

  it('should paginate items properly', () => {
    component.itemsPerPage.set(2);
    component.currentPage.set(1);
    fixture.detectChanges();

    expect(component.paginatedProducts().length).toBe(2);
    expect(component.totalPages()).toBe(2);

    component.goToPage(2);
    fixture.detectChanges();

    expect(component.paginatedProducts().length).toBe(1);
    expect(component.currentPage()).toBe(2);
  });

  it('should emit create event when Novo Produto button is clicked', () => {
    let created = false;
    component.create.subscribe(() => (created = true));

    const createBtn = fixture.nativeElement.querySelector('button[aria-label="Cadastrar novo produto"]');
    expect(createBtn).toBeTruthy();
    createBtn.click();

    expect(created).toBe(true);
  });

  it('should emit edit event when Edit button is clicked', () => {
    let editedProduct: Product | undefined;
    component.edit.subscribe((prod) => (editedProduct = prod));

    const editBtn = fixture.nativeElement.querySelector('button[title="Editar Produto"]');
    expect(editBtn).toBeTruthy();
    editBtn.click();

    expect(editedProduct).toBeDefined();
    expect(editedProduct?.id).toBe('prod-1');
  });

  it('should handle delete confirmation workflow', () => {
    let deletedId: string | undefined;
    component.delete.subscribe((id) => (deletedId = id));

    const deleteBtn = fixture.nativeElement.querySelector('button[title="Excluir Produto"]');
    expect(deleteBtn).toBeTruthy();
    deleteBtn.click();
    fixture.detectChanges();

    expect(component.deleteConfirmId()).toBe('prod-1');
    const cancelBtn = fixture.nativeElement.querySelector('button[aria-label="Cancelar exclusão de produto"]');
    expect(cancelBtn).toBeTruthy();
    cancelBtn.click();
    fixture.detectChanges();

    expect(component.deleteConfirmId()).toBeNull();

    const newDeleteBtn = fixture.nativeElement.querySelector('button[title="Excluir Produto"]');
    expect(newDeleteBtn).toBeTruthy();
    newDeleteBtn.click();
    fixture.detectChanges();

    const confirmBtn = fixture.nativeElement.querySelector('button[aria-label="Confirmar exclusão de produto"]');
    expect(confirmBtn).toBeTruthy();
    confirmBtn.click();

    expect(deletedId).toBe('prod-1');
    expect(component.deleteConfirmId()).toBeNull();
  });

  it('should render empty state when no products match filters', () => {
    component.searchQuery.set('Inexistente XYZ');
    fixture.detectChanges();

    const emptyRow = fixture.nativeElement.querySelector('tbody tr td[colspan="8"]');
    expect(emptyRow).toBeTruthy();
    expect(emptyRow.textContent).toContain('Nenhum produto encontrado');

    const resetBtn = emptyRow.querySelector('button');
    expect(resetBtn).toBeTruthy();
    resetBtn.click();
    fixture.detectChanges();

    expect(component.searchQuery()).toBe('');
    expect(component.filteredProducts().length).toBe(3);
  });
});
