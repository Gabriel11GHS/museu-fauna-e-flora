import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  OnInit,
  OnDestroy,
  AfterViewInit,
  ViewChild,
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

  // --- VIEW CHILDREN ---
  @ViewChild('heroCarousel') heroCarousel!: SlickCarouselComponent;
  @ViewChild('svgObject') svgObject?: ElementRef<HTMLObjectElement>;

  // --- ESTADO REATIVO (SIGNALS) ---
  public showCarousel = signal<boolean>(false);
  public isCarouselPlaying = signal<boolean>(false);
  public liveRegionMessage = signal<string>('');
  public localAtivo = signal<string | null>(null);

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
      link: '/Ficha' // Atenção: Verifique se a rota correta é '/flora' ou '/Ficha'
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
    { id: 'local-1', nome: 'Local 1', x: 69.73, y: 91.15 },
    { id: 'local-2', nome: 'Local 2', x: 78.11, y: 65.24 },
    { id: 'local-3', nome: 'Local 3', x: 51.35, y: 27.76 },
    { id: 'local-4', nome: 'Local 4', x: 37.04, y: 44.85 },
    { id: 'local-5', nome: 'Local 5', x: 47.44, y: 73.46 },
    { id: 'local-6', nome: 'Local 6', x: 41.24, y: 87.95 },
    { id: 'local-7', nome: 'Local 7', x: 11.68, y: 73.46 },
    { id: 'local-8', nome: 'Local 8', x: 22.43, y: 48.97 }
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
    this.atualizarAreaAtivaMapa(id);
  }

  limparLocalAtivo(): void {
    this.localAtivo.set(null);
    this.atualizarAreaAtivaMapa(null);
  }

  isLocalAtivo(id: string): boolean {
    return this.localAtivo() === id;
  }

  private configurarMapaLocais(): void {
    const svgDocument = this.svgObject?.nativeElement.contentDocument;

    if (!svgDocument) {
      return;
    }

    this.limparListenersMapaLocais();

    const elementos = svgDocument.querySelectorAll('[data-local-id]');

    elementos.forEach(elemento => {
      const id = elemento.getAttribute('data-local-id');

      if (!id) {
        return;
      }

      const local = this.locaisMapa.find(item => item.id === id);

      elemento.setAttribute('tabindex', '0');
      elemento.setAttribute('role', 'button');
      elemento.setAttribute('aria-label', local?.nome ?? id);

      this.adicionarListenerMapa(elemento, 'mouseenter', () => this.definirLocalAtivo(id));
      this.adicionarListenerMapa(elemento, 'mouseleave', () => this.limparLocalAtivo());
      this.adicionarListenerMapa(elemento, 'focus', () => this.definirLocalAtivo(id));
      this.adicionarListenerMapa(elemento, 'blur', () => this.limparLocalAtivo());
      this.adicionarListenerMapa(elemento, 'click', () => this.definirLocalAtivo(id));
      this.adicionarListenerMapa(elemento, 'keydown', (event: Event) => {
        const keyboardEvent = event as KeyboardEvent;

        if (keyboardEvent.key === 'Enter' || keyboardEvent.key === ' ') {
          keyboardEvent.preventDefault();
          this.definirLocalAtivo(id);
        }
      });
    });

    const style = svgDocument.createElementNS('http://www.w3.org/2000/svg', 'style') as SVGStyleElement;

    style.textContent = `
      [data-local-id] {
        cursor: pointer;
        outline: none;
        transition: opacity 0.2s ease, filter 0.2s ease;
      }

      [data-local-id],
      [data-local-id] * {
        transition: fill 0.2s ease, filter 0.2s ease, opacity 0.2s ease, stroke 0.2s ease;
      }

      [data-local-id]:hover,
      [data-local-id]:focus,
      [data-local-id].mapa-local--ativo {
        filter: drop-shadow(0 8px 10px rgba(63, 18, 53, 0.38));
      }

      [data-local-id]:hover :is(path, polygon, rect, circle, ellipse),
      [data-local-id]:focus :is(path, polygon, rect, circle, ellipse),
      [data-local-id].mapa-local--ativo :is(path, polygon, rect, circle, ellipse) {
        fill: #5b1f4d !important;
        stroke: #3f1235 !important;
        opacity: 0.94;
      }
    `;

    svgDocument.querySelector('svg')?.appendChild(style);
    this.mapaSvgStyle = style;
  }

  private adicionarListenerMapa(elemento: Element, tipo: string, listener: EventListener): void {
    elemento.addEventListener(tipo, listener);
    this.mapaSvgListeners.push({ elemento, tipo, listener });
  }

  private limparListenersMapaLocais(): void {
    this.mapaSvgListeners.forEach(({ elemento, tipo, listener }) => {
      elemento.removeEventListener(tipo, listener);
    });
    this.mapaSvgListeners = [];
    this.mapaSvgStyle?.remove();
    this.mapaSvgStyle = undefined;
  }

  private atualizarAreaAtivaMapa(id: string | null): void {
    const svgDocument = this.svgObject?.nativeElement.contentDocument;

    if (!svgDocument) {
      return;
    }

    svgDocument.querySelectorAll('[data-local-id]').forEach(elemento => {
      elemento.classList.toggle('mapa-local--ativo', elemento.getAttribute('data-local-id') === id);
    });
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