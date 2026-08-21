import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideNoopAnimations } from '@angular/platform-browser/animations';
import { provideRouter, Router } from '@angular/router';

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

  afterEach(() => {
    document.body.classList.remove('mff-dark-mode', 'mff-high-contrast');
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

  it('should keep the selected map location active and expose it for the side card', () => {
    component.selecionarLocal('local-7');

    expect(component.localSelecionado()).toBe('local-7');
    expect(component.isLocalAtivo('local-7')).toBeTrue();
    expect(component.obterLocalSelecionado()?.filtroFlora).toBe('Local 7');
  });

  it('should switch the active and selected map location when another local is selected', () => {
    component.selecionarLocal('local-7');
    component.selecionarLocal('local-3');

    expect(component.localSelecionado()).toBe('local-3');
    expect(component.obterLocalSelecionado()?.filtroFlora).toBe('Local 3');
    expect(component.isLocalAtivo('local-3')).toBeTrue();
    expect(component.isLocalAtivo('local-7')).toBeFalse();
  });

  it('should render the flora shortcut after selecting a map location', () => {
    component.selecionarLocal('local-7');
    fixture.detectChanges();

    const compiled: HTMLElement = fixture.nativeElement;
    const button = compiled.querySelector<HTMLButtonElement>('.home-mapa-locais__botao');

    expect(compiled.textContent).toContain('Local 7');
    expect(button?.textContent?.trim()).toBe('Ir para o catálogo de flora');
  });

  it('should update the rendered side card when a map listener selects a location', () => {
    const componentInternals = component as unknown as {
      executarAcaoMapa: (acao: () => void) => void;
      selecionarLocal: (id: string) => void;
    };

    componentInternals.executarAcaoMapa(() => componentInternals.selecionarLocal('local-7'));

    const compiled: HTMLElement = fixture.nativeElement;
    const button = compiled.querySelector<HTMLButtonElement>('.home-mapa-locais__botao');

    expect(compiled.textContent).toContain('Local 7');
    expect(button?.textContent?.trim()).toBe('Ir para o catálogo de flora');
  });

  it('should select the clicked SVG local element instead of using coordinate hit-tests', () => {
    const svgDocument = document.implementation.createHTMLDocument('mapa');
    const svg = svgDocument.createElementNS('http://www.w3.org/2000/svg', 'svg');
    const local = svgDocument.createElementNS('http://www.w3.org/2000/svg', 'g');
    const localShape = svgDocument.createElementNS('http://www.w3.org/2000/svg', 'path');
    const componentInternals = component as unknown as {
      configurarMapaLocais: () => void;
      svgObject: {
        nativeElement: {
          contentDocument: Document;
          removeEventListener: () => void;
        }
      };
    };

    local.setAttribute('data-local-id', 'local-3');
    localShape.setAttribute('d', 'M0 0H10V10H0Z');
    local.appendChild(localShape);
    svg.appendChild(local);
    svgDocument.body.appendChild(svg);

    componentInternals.svgObject = {
      nativeElement: {
        contentDocument: svgDocument,
        removeEventListener: () => undefined
      }
    };

    componentInternals.configurarMapaLocais();
    localShape.dispatchEvent(new MouseEvent('click', { bubbles: true }));

    expect(component.localSelecionado()).toBe('local-3');
    expect(component.obterLocalSelecionado()?.filtroFlora).toBe('Local 3');
  });

  it('should select an SVG local element on the first pointer interaction', () => {
    const svgDocument = document.implementation.createHTMLDocument('mapa');
    const svg = svgDocument.createElementNS('http://www.w3.org/2000/svg', 'svg');
    const local = svgDocument.createElementNS('http://www.w3.org/2000/svg', 'g');
    const localShape = svgDocument.createElementNS('http://www.w3.org/2000/svg', 'path');
    const componentInternals = component as unknown as {
      configurarMapaLocais: () => void;
      svgObject: {
        nativeElement: {
          contentDocument: Document;
          removeEventListener: () => void;
        }
      };
    };

    local.setAttribute('data-local-id', 'local-5');
    localShape.setAttribute('d', 'M0 0H10V10H0Z');
    local.appendChild(localShape);
    svg.appendChild(local);
    svgDocument.body.appendChild(svg);

    componentInternals.svgObject = {
      nativeElement: {
        contentDocument: svgDocument,
        removeEventListener: () => undefined
      }
    };

    componentInternals.configurarMapaLocais();
    localShape.dispatchEvent(new MouseEvent('pointerdown', { bubbles: true, button: 0 }));

    expect(component.localSelecionado()).toBe('local-5');
    expect(component.obterLocalSelecionado()?.filtroFlora).toBe('Local 5');
  });

  it('should wire SVG groups named after map locals when data attributes are missing', () => {
    const svgDocument = document.implementation.createHTMLDocument('mapa');
    const svg = svgDocument.createElementNS('http://www.w3.org/2000/svg', 'svg');
    const local = svgDocument.createElementNS('http://www.w3.org/2000/svg', 'g');
    const localShape = svgDocument.createElementNS('http://www.w3.org/2000/svg', 'path');
    const componentInternals = component as unknown as {
      configurarMapaLocais: () => void;
      svgObject: {
        nativeElement: {
          contentDocument: Document;
          removeEventListener: () => void;
        }
      };
    };

    local.setAttribute('id', 'Local 3');
    localShape.setAttribute('d', 'M0 0H10V10H0Z');
    local.appendChild(localShape);
    svg.appendChild(local);
    svgDocument.body.appendChild(svg);

    componentInternals.svgObject = {
      nativeElement: {
        contentDocument: svgDocument,
        removeEventListener: () => undefined
      }
    };

    componentInternals.configurarMapaLocais();
    localShape.dispatchEvent(new MouseEvent('click', { bubbles: true }));

    expect(local.getAttribute('data-local-id')).toBe('local-3');
    expect(component.localSelecionado()).toBe('local-3');
  });

  it('should mirror accessibility theme classes into the embedded map SVG', () => {
    const svgDocument = document.implementation.createHTMLDocument('mapa');
    const svg = svgDocument.createElementNS('http://www.w3.org/2000/svg', 'svg');
    const componentInternals = component as unknown as {
      configurarMapaLocais: () => void;
      atualizarTemaMapaSvg: () => void;
      svgObject: {
        nativeElement: {
          contentDocument: Document;
          removeEventListener: () => void;
        }
      };
    };

    svgDocument.body.appendChild(svg);
    componentInternals.svgObject = {
      nativeElement: {
        contentDocument: svgDocument,
        removeEventListener: () => undefined
      }
    };

    document.body.classList.add('mff-dark-mode');
    componentInternals.configurarMapaLocais();

    expect(svg.classList.contains('mff-map-dark')).toBeTrue();
    expect(svg.classList.contains('mff-map-high-contrast')).toBeFalse();

    document.body.classList.remove('mff-dark-mode');
    document.body.classList.add('mff-high-contrast');
    componentInternals.atualizarTemaMapaSvg();

    expect(svg.classList.contains('mff-map-dark')).toBeFalse();
    expect(svg.classList.contains('mff-map-high-contrast')).toBeTrue();
  });

  it('should navigate to /Ficha with the selected local as query param', () => {
    const router = TestBed.inject(Router);
    const navigateSpy = spyOn(router, 'navigate').and.resolveTo(true);

    component.irParaFlora(component.locaisMapa[6]);

    expect(navigateSpy).toHaveBeenCalledWith(['/Ficha'], {
      queryParams: { local: 'Local 7' }
    });
  });
});
