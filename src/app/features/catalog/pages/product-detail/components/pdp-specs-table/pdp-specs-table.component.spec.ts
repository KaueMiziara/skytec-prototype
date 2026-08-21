import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PdpSpecsTableComponent } from './pdp-specs-table.component';

describe('PdpSpecsTableComponent', () => {
  let component: PdpSpecsTableComponent;
  let fixture: ComponentFixture<PdpSpecsTableComponent>;

  const mockSpecs = {
    'Tipo de Máquina': 'Reta Industrial',
    'Tipo de Motor': 'Direct Drive integrado',
    'Velocidade Máxima': '5.000 rpm',
    'Voltagem': '220V'
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PdpSpecsTableComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(PdpSpecsTableComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('specifications', mockSpecs);
    fixture.componentRef.setInput('productName', 'Jack A2C');
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render all specification keys and values in table', () => {
    const text = fixture.nativeElement.textContent;
    expect(text).toContain('Especificações Técnicas');
    expect(text).toContain('Tipo de Máquina');
    expect(text).toContain('Reta Industrial');
    expect(text).toContain('Tipo de Motor');
    expect(text).toContain('Direct Drive integrado');
    expect(text).toContain('Velocidade Máxima');
    expect(text).toContain('5.000 rpm');
    expect(text).toContain('Voltagem');
    expect(text).toContain('220V');
  });

  it('should render table rows with zebra striping', () => {
    const rows = fixture.nativeElement.querySelectorAll('tbody tr');
    expect(rows.length).toBe(4);
    expect(rows[0].classList.contains('bg-white')).toBe(true);
    expect(rows[1].classList.contains('bg-[#f5f5f7]')).toBe(true);
    expect(rows[2].classList.contains('bg-white')).toBe(true);
    expect(rows[3].classList.contains('bg-[#f5f5f7]')).toBe(true);
  });

  it('should render empty state message when specifications object is empty', () => {
    fixture.componentRef.setInput('specifications', {});
    fixture.detectChanges();

    const text = fixture.nativeElement.textContent;
    expect(text).toContain('Especificações técnicas detalhadas sob consulta');
    const table = fixture.nativeElement.querySelector('table');
    expect(table).toBeNull();
  });
});
