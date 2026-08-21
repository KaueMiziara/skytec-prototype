import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PdpGalleryComponent } from './pdp-gallery.component';

describe('PdpGalleryComponent', () => {
  let component: PdpGalleryComponent;
  let fixture: ComponentFixture<PdpGalleryComponent>;

  const mockImages = [
    '/assets/mock/test-1.jpg',
    '/assets/mock/test-2.jpg',
    '/assets/mock/test-3.jpg'
  ];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PdpGalleryComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(PdpGalleryComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('images', mockImages);
    fixture.componentRef.setInput('productName', 'Máquina Reta Teste');
    fixture.componentRef.setInput('brand', 'SKYMAK');
    fixture.componentRef.setInput('category', 'Reta');
    fixture.componentRef.setInput('sku', 'R8-TEST');
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render badges for brand, category, and sku', () => {
    const text = fixture.nativeElement.textContent;
    expect(text).toContain('SKYMAK');
    expect(text).toContain('Reta');
    expect(text).toContain('R8-TEST');
  });

  it('should display the first image by default', () => {
    const mainImg = fixture.nativeElement.querySelector('img') as HTMLImageElement;
    expect(mainImg).toBeTruthy();
    expect(mainImg.src).toContain(mockImages[0]);
  });

  it('should allow selecting another image from thumbnails', () => {
    component.selectImage(1);
    fixture.detectChanges();

    const mainImg = fixture.nativeElement.querySelector('img') as HTMLImageElement;
    expect(mainImg.src).toContain(mockImages[1]);
  });

  it('should navigate to next and previous images', () => {
    component.nextImage();
    fixture.detectChanges();
    let mainImg = fixture.nativeElement.querySelector('img') as HTMLImageElement;
    expect(mainImg.src).toContain(mockImages[1]);

    component.previousImage();
    fixture.detectChanges();
    mainImg = fixture.nativeElement.querySelector('img') as HTMLImageElement;
    expect(mainImg.src).toContain(mockImages[0]);

    component.previousImage();
    fixture.detectChanges();
    mainImg = fixture.nativeElement.querySelector('img') as HTMLImageElement;
    expect(mainImg.src).toContain(mockImages[2]);
  });

  it('should show fallback when active image fails to load', () => {
    component.handleImageError(0);
    fixture.detectChanges();

    const fallbackSvg = fixture.nativeElement.querySelector('svg');
    expect(fallbackSvg).toBeTruthy();
    expect(fixture.nativeElement.textContent).toContain('Imagem não disponível');
  });

  it('should handle empty image list gracefully', () => {
    fixture.componentRef.setInput('images', []);
    fixture.detectChanges();

    expect(component).toBeTruthy();
    expect(fixture.nativeElement.textContent).toContain('Imagem não disponível');
  });
});
