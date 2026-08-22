import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { MediaSectionComponent } from './media-section.component';
import { CartService } from '../../../../core/services/cart.service';

describe('MediaSectionComponent', () => {
  let component: MediaSectionComponent;
  let fixture: ComponentFixture<MediaSectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MediaSectionComponent],
      providers: [provideRouter([]), CartService]
    }).compileComponents();

    fixture = TestBed.createComponent(MediaSectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render section title and video items', () => {
    const heading = fixture.nativeElement.querySelector('h2');
    expect(heading.textContent).toContain('Maquinário em Ação nas Confecções');

    const videoButtons = fixture.nativeElement.querySelectorAll('button[role="listitem"]');
    expect(videoButtons.length).toBe(component.mediaList.length);
  });

  it('should render YouTube iframe with sanitized embed URL', () => {
    const iframe = fixture.nativeElement.querySelector('iframe');
    expect(iframe).toBeTruthy();
    expect(iframe.getAttribute('src')).toContain('https://www.youtube-nocookie.com/embed/JA6ocV5kqaE');
    expect(iframe.getAttribute('title')).toBe(component.activeVideo()?.title);
  });

  it('should change active video when a video button is clicked', () => {
    const videoButtons = fixture.nativeElement.querySelectorAll('button[role="listitem"]');
    const secondButton = videoButtons[1] as HTMLButtonElement;

    secondButton.click();
    fixture.detectChanges();

    expect(component.activeVideo()?.id).toBe(component.mediaList[1].id);
    const iframe = fixture.nativeElement.querySelector('iframe');
    expect(iframe).toBeTruthy();
    expect(iframe.getAttribute('src')).toContain('https://www.youtube-nocookie.com/embed/JA6ocV5kqaE');
  });

  it('should render link to featured machine details', () => {
    const link = Array.from(fixture.nativeElement.querySelectorAll('a')).find((a) =>
      (a as HTMLElement).textContent?.includes('Ver Máquina')
    ) as HTMLAnchorElement;

    expect(link).toBeTruthy();
    expect(link.getAttribute('href')).toContain('PROD-SKYMAK-R8');
  });
});

