import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideNoopAnimations } from '@angular/platform-browser/animations';
import { provideRouter } from '@angular/router';

import { HomeComponent } from './home.component';

describe('HomeComponent', () => {
  let component: HomeComponent;
  let fixture: ComponentFixture<HomeComponent>;

  beforeEach(async () => {
    const slickStub = () => ({
      slick: () => undefined,
      on: () => undefined,
      off: () => undefined
    });

    (window as unknown as { jQuery: unknown; $: unknown }).jQuery = slickStub;
    (window as unknown as { jQuery: unknown; $: unknown }).$ = slickStub;

    await TestBed.configureTestingModule({
      imports: [HomeComponent],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        provideNoopAnimations(),
        provideRouter([])
      ]
    })
      .compileComponents();

    fixture = TestBed.createComponent(HomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should expose the eight SVG areas used by the home map labels', () => {
    expect(component.locaisMapa.map(local => local.id)).toEqual([
      'local-1',
      'local-2',
      'local-3',
      'local-4',
      'local-5',
      'local-6',
      'local-7',
      'local-8'
    ]);
  });

  it('should render the SVG object instead of the old Leaflet container', () => {
    const compiled: HTMLElement = fixture.nativeElement;

    expect(compiled.querySelector('object.home-mapa-locais__svg')).toBeTruthy();
    expect(compiled.querySelector('#map')).toBeNull();
  });
});
