import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  AfterViewInit,
  ChangeDetectorRef,
  ViewChild,
  ViewEncapsulation
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { SlickCarouselComponent, SlickCarouselModule } from 'ngx-slick-carousel';
import { forkJoin, Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { ApiService, Planta } from '../../services/api.service';
import { FaunaService } from '../../services/fauna.service';
import { trigger, transition, style, animate } from '@angular/animations';


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
  encapsulation: ViewEncapsulation.None, 
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    'class': 'app-home-wrapper'
  },
  animations: [
    trigger('fadeIn', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('1s ease-out', style({ opacity: 1 }))
      ])
    ])
  ]
})
export class HomeComponent implements OnInit, AfterViewInit {

  @ViewChild('heroCarousel') heroCarousel!: SlickCarouselComponent;

  public destaques$!: Observable<Destaque[]>;
  public showCarousel: boolean = false;
  public isCarouselPlaying: boolean = true;
  public liveRegionMessage: string = '';

  // Configurações do Carrossel da seção Hero
  mediaItems = [
    { image: 'assets/home/carrossel-1.jpg', alt: 'Vista do campus do ICMC' },
    { image: 'assets/home/carrossel-2.jpg', alt: 'Detalhe de uma flor de Ipê Amarelo' },
    { image: 'assets/home/carrossel-3.jpg', alt: 'Capivara no gramado da USP' }
  ];

  slideConfig = {
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: false,
    infinite: true,
    fade: true,
    cssEase: 'linear',
    dots: true,
    arrows: true,
    accessibility: true, // Garante navegação via teclado para setas e pontos.
    pauseOnHover: true,  // Pausa a animação ao passar o mouse. [cite: 97]
    pauseOnFocus: true,  // Pausa a animação quando um elemento (seta/ponto) recebe foco. [cite: 97]
  };

  destaquesPrincipais = [
    {
      icone: 'park',
      titulo: 'Explore a Flora',
      descricao: 'Navegue por um catálogo completo das árvores e plantas do campus.',
      link: '/flora'
    },
    {
      icone: 'pets',
      titulo: 'Conheça a Fauna',
      descricao: 'Descubra os animais que habitam o nosso ecossistema local.',
      link: '/fauna'
    },
    {
      icone: 'map',
      titulo: 'Mapa Interativo',
      descricao: 'Localize as espécies e explore os diferentes ambientes do instituto.',
      link: '/mapa' // Lembre-se de criar essa rota no futuro
    }
  ];

  constructor(
    private apiService: ApiService,
    private faunaService: FaunaService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.destaques$ = forkJoin({
      plantas: this.apiService.getPlantas().pipe(catchError(() => of([]))),
      animais: this.faunaService.getAnimais().pipe(catchError(() => of([])))
    }).pipe(
      map(({ plantas, animais }) => {
        const destaquesFlora: Destaque[] = plantas
          .filter(p => !!(p.fotoIndividuo || p.fotoTaxonomia))
          .map(planta => ({
            nome: planta.nomePopular || 'Planta não identificada',
            imagem: (planta.fotoIndividuo || planta.fotoTaxonomia) ?? 'assets/placeholder.jpg',
            tipo: 'Flora',
            link: `/flora/${planta.idIndividuo}`
          }));

        const destaquesFauna: Destaque[] = animais.map(animal => ({
          nome: animal.nomePopular,
          imagem: animal.imagem ?? 'assets/placeholder.jpg',
          tipo: 'Fauna',
          link: `/fauna`
        }));

        const combinados = [...destaquesFlora, ...destaquesFauna];
        return this.embaralharArray(combinados).slice(0, 8);
      })
    );
  }

  ngAfterViewInit(): void {
    // O setTimeout(0) garante que a inicialização do carrossel ocorra após a detecção de mudanças inicial do Angular.
    setTimeout(() => {
      this.showCarousel = true;
      this.cdr.detectChanges(); // Força a detecção de mudanças para renderizar o carrossel.
      this.onCarouselAfterChange({ currentSlide: 0 }); // Define a mensagem inicial para a live region.
    }, 0);
  }

  togglePlayPause(): void {
    if (this.isCarouselPlaying) {
      this.heroCarousel.slickPause();
    } else {
      this.heroCarousel.slickPlay();
    }
    this.isCarouselPlaying = !this.isCarouselPlaying;
  }

  onCarouselAfterChange(event: { currentSlide: number }): void {
    const current = event.currentSlide + 1;
    const total = this.mediaItems.length;
    this.liveRegionMessage = `Slide ${current} de ${total}: ${this.mediaItems[event.currentSlide].alt}`;
    this.cdr.detectChanges(); // Notifica o Angular sobre a mudança na mensagem.
  }

  private embaralharArray(array: any[]): any[] {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }

  trackByDestaque(index: number, destaque: Destaque): string {
    return destaque.link;
  }
}
