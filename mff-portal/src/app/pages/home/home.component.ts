import {
  ChangeDetectionStrategy,
  Component,
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

// Declaração do Leaflet (global)
declare var L: any;

export interface Destaque {
  nome: string;
  imagem: string;
  tipo: 'Fauna' | 'Flora';
  link: string;
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

  // --- ESTADO REATIVO (SIGNALS) ---
  public showCarousel = signal<boolean>(false);
  public isCarouselPlaying = signal<boolean>(false);
  public liveRegionMessage = signal<string>('');

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
        tipo: 'Fauna',
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
    
    // Inicializa o mapa separadamente para organização
    this.initLeafletMap();
  }

  ngOnDestroy(): void {
    this.headerStateService.setIsHomePage(false);
  }

  // --- MÉTODOS DE LÓGICA ---

  private initLeafletMap(): void {
    // Verifica se L (Leaflet) está disponível
    if (typeof L === 'undefined') return;

    // Cria o mapa
    const map = L.map('map').setView([-22.0029, -47.8913], 16);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors'
    }).addTo(map);

    // Carrega KML
    fetch('assets/mapa/Local7.kml')
      .then(res => res.text())
      .then(kmltext => {
        const parser = new DOMParser();
        const kml = parser.parseFromString(kmltext, 'text/xml');
        // @ts-ignore (KML plugin typing workaround)
        const track = new L.KML(kml);
        map.addLayer(track);
        map.fitBounds(track.getBounds());
      })
      .catch(err => console.error('Erro ao carregar mapa KML:', err));
  }

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

  private embaralharArray<T>(array: T[]): T[] {
    const arr = array.slice();
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  }
}