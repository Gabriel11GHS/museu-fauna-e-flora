import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  OnInit,
  OnDestroy,
  AfterViewInit,
  ViewChild,
  NgZone,
  inject,
  signal
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { forkJoin, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { trigger, transition, style, animate } from '@angular/animations';

// Serviços e Modelos
import { ApiService } from '../../services/api.service';
import { FaunaService } from '../../services/fauna.service';
import { HeaderStateService } from '../../services/header-state.service';
import { LiveAvailabilityService } from '../../services/live-availability.service';

// Bibliotecas Externas
import { SlickCarouselComponent, SlickCarouselModule } from 'ngx-slick-carousel';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';


export interface Destaque {
  nome: string;
  imagem: string;
  tipo: 'Fauna' | 'Flora';
  link: string;
}

interface LocalMapaHome {
  id: string;
  nome: string;
  filtroFlora: string;
  descricao?: string;
  x: number;
  y: number;
}

interface MapaSvgListener {
  elemento: Element;
  tipo: string;
  listener: EventListener;
}

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    SlickCarouselModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule
  ],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [
    trigger('fadeIn', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('1s ease-out', style({ opacity: 1 }))
      ])
    ])
  ]
})

export class HomeComponent implements OnInit, OnDestroy, AfterViewInit {
  // --- INJEÇÃO DE DEPENDÊNCIAS ---
  private headerStateService = inject(HeaderStateService);
  private apiService = inject(ApiService);
  private faunaService = inject(FaunaService);
  private router = inject(Router);
  private ngZone = inject(NgZone);
  private changeDetectorRef = inject(ChangeDetectorRef);
  private readonly liveAvailabilityService = inject(LiveAvailabilityService);
  readonly liveStatus = this.liveAvailabilityService.status;

  // --- VIEW CHILDREN ---
  @ViewChild('heroCarousel') heroCarousel!: SlickCarouselComponent;
  @ViewChild('svgObject') svgObject?: ElementRef<HTMLObjectElement>;

  // --- ESTADO REATIVO (SIGNALS) ---
  public showCarousel = signal<boolean>(false);
  public isCarouselPlaying = signal<boolean>(false);
  public liveRegionMessage = signal<string>('');
  public localAtivo = signal<string | null>(null);
  public localSelecionado = signal<string | null>(null);

  // --- DADOS ESTÁTICOS ---
  public destaquesPrincipais = [
    {
      imagemIcone: 'assets/icons/fauna.png',
      titulo: 'Fauna',
      descricao: 'Conheça a diversidade de animais do nosso acervo.',
      link: '/fauna'
    },
    {
      imagemIcone: 'assets/icons/flora.png',
      titulo: 'Flora',
      descricao: 'Explore as espécies de plantas catalogadas.',
      link: '/Ficha'
    },
    {
      icone: 'map',
      titulo: 'Mapa',
      descricao: 'Veja onde estão localizados os principais pontos do Instituto.',
      link: 'mapa-section'
    }
  ];

  public mediaItems = [
    { image: 'assets/home/carrossel-1.jpg', alt: 'Imagem 1 do Carrossel' },
    { image: 'assets/home/carrossel-2.jpg', alt: 'Imagem 2 do Carrossel' },
    { image: 'assets/home/carrossel-3.jpg', alt: 'Imagem 3 do Carrossel' },
    { image: 'assets/home/carrossel-4.jpg', alt: 'Imagem 4 do Carrossel' },
    { image: 'assets/home/carrossel-5.jpg', alt: 'Imagem 5 do Carrossel' },
    { image: 'assets/home/carrossel-6.jpg', alt: 'Imagem 6 do Carrossel' }
  ];

  public slideConfig = {
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: false,
    infinite: true,
    fade: true,
    cssEase: 'linear',
    dots: true,
    arrows: true
  };


  public locaisMapa: LocalMapaHome[] = [
    {
      id: 'local-1',
      nome: 'Local 1',
      filtroFlora: 'Local 1',
      descricao: 'Região 1 do mapa do campus usada no cadastro da flora.',
      x: 75.69,
      y: 90.96
    },
    {
      id: 'local-2',
      nome: 'Local 2',
      filtroFlora: 'Local 2',
      descricao: 'Região 2 do mapa do campus usada no cadastro da flora.',
      x: 77.66,
      y: 71.37
    },
    {
      id: 'local-3',
      nome: 'Local 3',
      filtroFlora: 'Local 3',
      descricao: 'Região 3 do mapa do campus usada no cadastro da flora.',
      x: 51.37,
      y: 27.76
    },
    {
      id: 'local-4',
      nome: 'Local 4',
      filtroFlora: 'Local 4',
      descricao: 'Região 4 do mapa do campus usada no cadastro da flora.',
      x: 37,
      y: 37.77
    },
    {
      id: 'local-5',
      nome: 'Local 5',
      filtroFlora: 'Local 5',
      descricao: 'Região 5 do mapa do campus usada no cadastro da flora.',
      x: 44.01,
      y: 70.26
    },
    {
      id: 'local-6',
      nome: 'Local 6',
      filtroFlora: 'Local 6',
      descricao: 'Região 6 do mapa do campus usada no cadastro da flora.',
      x: 33.56,
      y: 90.89
    },
    {
      id: 'local-7',
      nome: 'Local 7',
      filtroFlora: 'Local 7',
      descricao: 'Região 7 do mapa do campus usada no cadastro da flora.',
      x: 19.14,
      y: 77.41
    },
    {
      id: 'local-8',
      nome: 'Local 8',
      filtroFlora: 'Local 8',
      descricao: 'Região 8 do mapa do campus usada no cadastro da flora.',
      x: 15.02,
      y: 33.2
    }
  ];

  private mapaSvgListeners: MapaSvgListener[] = [];
  private mapaSvgStyle?: SVGStyleElement;
  private readonly onMapaSvgLoad = (): void => this.configurarMapaLocais();

  // --- DADOS DINÂMICOS (OBSERVABLE -> SIGNAL) ---
  
  // Observable fonte que busca e combina dados
  private destaquesSource$ = forkJoin({
    plantas: this.apiService.getPlantasAtivas().pipe(catchError(() => of([]))),
    animais: this.faunaService.getAnimais().pipe(catchError(() => of([])))
  }).pipe(
    map(({ plantas, animais }) => {
      const destaquesFlora: Destaque[] = plantas
        .filter(p => !!(p.fotoIndividuo || p.fotoTaxonomia))
        .map(planta => ({
          nome: planta.nomePopular || 'Planta não identificada',
          imagem: (planta.fotoIndividuo || planta.fotoTaxonomia) ?? 'assets/placeholder.jpg',
          tipo: 'Flora',
          link: `/Ficha` // Ajuste conforme rota real
        }));

      const destaquesFauna: Destaque[] = animais.map(animal => ({
        nome: animal.nomePopular,
        imagem: animal.imagem ?? 'assets/placeholder.jpg',
        tipo: 'Fauna' as const,
        link: `/fauna`
      }));

      // Combina e embaralha
      const combinados = [...destaquesFlora, ...destaquesFauna];
      return this.embaralharArray(combinados).slice(0, 8);
    })
  );

  // Signal pronto para uso no template
  public destaques = toSignal(this.destaquesSource$, { initialValue: [] });

  // --- LIFECYCLE HOOKS ---

  ngOnInit(): void {
    this.headerStateService.setIsHomePage(true);
  }

  ngAfterViewInit(): void {
    // Inicializa o carrossel sem setTimeout, apenas atualizando o sinal
    this.showCarousel.set(true);
    
    const objectElement = this.svgObject?.nativeElement;

    if (objectElement) {
      objectElement.addEventListener('load', this.onMapaSvgLoad);

      if (objectElement.contentDocument) {
        this.configurarMapaLocais();
      }
    }
  }

  ngOnDestroy(): void {
    this.headerStateService.setIsHomePage(false);
    this.svgObject?.nativeElement.removeEventListener('load', this.onMapaSvgLoad);
    this.limparListenersMapaLocais();
  }

  // --- MÉTODOS DE LÓGICA ---

  navigateTo(link: string): void {
    if (link.startsWith('/')) {
      this.router.navigate([link]);
    } else {
      const element = document.getElementById(link);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  }

  togglePlayPause(): void {
    if (this.isCarouselPlaying()) {
      this.heroCarousel.slickPause();
    } else {
      this.heroCarousel.slickPlay();
    }
    this.isCarouselPlaying.update(v => !v);
  }

  onCarouselAfterChange(event: { currentSlide: number }): void {
    // Atualiza apenas o sinal, sem chamar detectChanges manualmente
    this.liveRegionMessage.set(`Slide ${event.currentSlide + 1} ativo`);
  }


  definirLocalAtivo(id: string): void {
    this.localAtivo.set(id);
    this.atualizarAreaAtivaMapa();
  }

  limparLocalAtivo(): void {
    this.localAtivo.set(null);
    this.atualizarAreaAtivaMapa();
  }

  selecionarLocal(id: string): void {
    this.localSelecionado.set(id);
    this.localAtivo.set(id);
    this.atualizarAreaAtivaMapa();
  }

  isLocalAtivo(id: string): boolean {
    return id === (this.localAtivo() ?? this.localSelecionado());
  }

  obterLocalSelecionado(): LocalMapaHome | undefined {
    const id = this.localSelecionado();
    return this.locaisMapa.find(local => local.id === id);
  }

  irParaFlora(local: LocalMapaHome): void {
    this.router.navigate(['/Ficha'], {
      queryParams: {
        local: local.filtroFlora
      }
    });
  }

  private configurarMapaLocais(): void {
    const svgDocument = this.svgObject?.nativeElement.contentDocument;

    if (!svgDocument) {
      return;
    }

    this.limparListenersMapaLocais();

    const elementos = svgDocument.querySelectorAll('[data-local-id]');
    const svg = svgDocument.querySelector('svg');

    elementos.forEach(elemento => {
      const id = elemento.getAttribute('data-local-id');

      if (!id) {
        return;
      }

      const local = this.locaisMapa.find(item => item.id === id);

      elemento.setAttribute('tabindex', '0');
      elemento.setAttribute('role', 'button');
      elemento.setAttribute('aria-label', local?.nome ?? id);

      this.adicionarListenerMapa(elemento, 'mouseenter', () => this.executarAcaoMapa(() => this.definirLocalAtivo(id)));
      this.adicionarListenerMapa(elemento, 'mouseleave', () => this.executarAcaoMapa(() => this.limparLocalAtivo()));
      this.adicionarListenerMapa(elemento, 'focus', () => this.executarAcaoMapa(() => this.definirLocalAtivo(id)));
      this.adicionarListenerMapa(elemento, 'blur', () => this.executarAcaoMapa(() => this.limparLocalAtivo()));
      this.adicionarListenerMapa(elemento, 'pointerdown', (event: Event) => this.selecionarLocalPorInteracao(id, event));
      this.adicionarListenerMapa(elemento, 'click', (event: Event) => this.selecionarLocalPorInteracao(id, event));
      this.adicionarListenerMapa(elemento, 'keydown', (event: Event) => {
        const keyboardEvent = event as KeyboardEvent;

        if (keyboardEvent.key === 'Enter' || keyboardEvent.key === ' ') {
          keyboardEvent.preventDefault();
          this.executarAcaoMapa(() => this.selecionarLocal(id));
        }
      });
    });

    svg && this.adicionarListenerMapa(svg, 'mouseleave', () => this.executarAcaoMapa(() => this.limparLocalAtivo()));

    const style = svgDocument.createElementNS('http://www.w3.org/2000/svg', 'style') as SVGStyleElement;

    style.textContent = `
      [data-local-id] {
        cursor: pointer;
        outline: none;
        transition: opacity 0.2s ease, filter 0.2s ease;
      }

      [data-local-id],
      [data-local-id] * {
        transition: fill 0.2s ease, filter 0.2s ease, opacity 0.2s ease, stroke 0.2s ease, transform 0.2s ease;
      }

      [data-local-id] > [id$=" - linha"] {
        fill: #000000;
        fill-opacity: 0.001;
        pointer-events: visibleFill;
      }

      #rua,
      #predios,
      #caminhaveis {
        pointer-events: none;
      }

      [data-local-id] [fill="#286D2C"] {
        transform-box: fill-box;
        transform-origin: center;
      }

      [data-local-id]:hover [fill="#286D2C"],
      [data-local-id]:focus [fill="#286D2C"],
      [data-local-id].mapa-local--ativo [fill="#286D2C"] {
        fill: #5b1f4d !important;
        stroke: #3f1235 !important;
        filter: drop-shadow(0 10px 12px rgba(63, 18, 53, 0.5));
        opacity: 0.98;
        transform: scale(1.035);
      }
    `;

    svg?.appendChild(style);
    this.mapaSvgStyle = style;
  }

  private adicionarListenerMapa(elemento: Element, tipo: string, listener: EventListener): void {
    elemento.addEventListener(tipo, listener);
    this.mapaSvgListeners.push({ elemento, tipo, listener });
  }

  private selecionarLocalPorInteracao(id: string, event: Event): void {
    const pointerEvent = event as PointerEvent;

    if (event.type === 'pointerdown' && pointerEvent.pointerType === 'mouse' && pointerEvent.button !== 0) {
      return;
    }

    event.preventDefault();
    this.executarAcaoMapa(() => this.selecionarLocal(id));
  }

  private executarAcaoMapa(acao: () => void): void {
    this.ngZone.run(() => {
      acao();
      this.changeDetectorRef.detectChanges();
    });
  }

  private limparListenersMapaLocais(): void {
    this.mapaSvgListeners.forEach(({ elemento, tipo, listener }) => {
      elemento.removeEventListener(tipo, listener);
    });
    this.mapaSvgListeners = [];
    this.mapaSvgStyle?.remove();
    this.mapaSvgStyle = undefined;
  }

  private atualizarAreaAtivaMapa(): void {
    const svgDocument = this.svgObject?.nativeElement.contentDocument;

    if (!svgDocument) {
      return;
    }

    const idAtivo = this.localAtivo() ?? this.localSelecionado();

    svgDocument.querySelectorAll('[data-local-id]').forEach(elemento => {
      const idElemento = elemento.getAttribute('data-local-id');
      const ativo = !!idElemento && idElemento === idAtivo;
      elemento.classList.toggle('mapa-local--ativo', ativo);
      this.atualizarOrdemVisualDoLocal(elemento, ativo);
    });

  }

  private atualizarOrdemVisualDoLocal(elemento: Element, ativo: boolean): void {
    const linha = Array.from(elemento.children).find(filho => {
      const idFilho = filho.getAttribute('id') ?? '';
      return idFilho.includes(' - linha');
    });

    if (linha) {
      elemento.appendChild(linha);
    }

    if (!ativo) {
      return;
    }

    Array.from(elemento.children)
      .filter(filho => filho.querySelector('[fill="#286D2C"]'))
      .forEach(grupoVerde => elemento.appendChild(grupoVerde));
  }

  private embaralharArray<T>(array: T[]): T[] {
    const arr = array.slice();
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  }
}
