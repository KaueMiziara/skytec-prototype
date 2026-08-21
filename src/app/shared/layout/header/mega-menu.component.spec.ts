import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { MegaMenuComponent } from './mega-menu.component';
import { ProductService } from '../../../core/services/product.service';

describe('MegaMenuComponent', () => {
  let component: MegaMenuComponent;
  let fixture: ComponentFixture<MegaMenuComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MegaMenuComponent],
      providers: [provideRouter([]), ProductService]
    }).compileComponents();

    fixture = TestBed.createComponent(MegaMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should not render menu container when isOpen is false', () => {
    const menu = fixture.nativeElement.querySelector('[role="menu"]');
    expect(menu).toBeNull();
  });

  it('should render menu container when isOpen is true', () => {
    fixture.componentRef.setInput('isOpen', true);
    fixture.detectChanges();

    const menu = fixture.nativeElement.querySelector('[role="menu"]');
    expect(menu).not.toBeNull();
  });

  it('should emit close when escape key is pressed while open', () => {
    fixture.componentRef.setInput('isOpen', true);
    fixture.detectChanges();

    let closed = false;
    component.close.subscribe(() => {
      closed = true;
    });

    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));
    expect(closed).toBe(true);
  });
});
