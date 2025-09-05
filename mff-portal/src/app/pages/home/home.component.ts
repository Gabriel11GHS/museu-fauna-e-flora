import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  OnDestroy,
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
import { ApiService } from '../../services/api.service';
import { Planta } from '../../models/planta.model';
import { FaunaService } from '../../services/fauna.service';
import { trigger, transition, style, animate } from '@angular/animations';
import { HeaderStateService } from '../../services/header-state.service';
import { AfterViewInit } from '@angular/core';
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
export class HomeComponent implements OnInit, OnDestroy, AfterViewInit {
  @ViewChild('heroCarousel') heroCarousel!: SlickCarouselComponent;

  public destaques$!: Observable<Destaque[]>;
  public showCarousel: boolean = false;
  public isCarouselPlaying: boolean = true;
  public liveRegionMessage: string = '';

  destaquesPrincipais = [
    {
      icone: 'eco',
      titulo: 'Fauna',
      descricao: 'Conheça a diversidade de animais do nosso acervo.',
      link: '/fauna'
    },
    {
      icone: 'local_florist',
      titulo: 'Flora',
      descricao: 'Explore as espécies de plantas catalogadas.',
      link: '/flora'
    },
    {
      icone: 'map',
      titulo: 'Mapa',
      descricao: 'Veja onde estão localizados os principais pontos do Instituto.',
      link: '/mapa'
    }
  ];

  constructor(
    private headerStateService: HeaderStateService, // Injetado
    private apiService: ApiService,
    private faunaService: FaunaService,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    // Informa ao serviço que a HomeComponent está ativa
    this.headerStateService.setIsHomePage(true);

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

  ngOnDestroy(): void {
    // Informa ao serviço que a HomeComponent foi destruída (limpando o estado)
    this.headerStateService.setIsHomePage(false);
  }

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
    arrows: true
  };

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.showCarousel = true;
      this.cdr.detectChanges();
      this.onCarouselAfterChange({ currentSlide: 0 });
    }, 0);

    // Cria o mapa centralizado no ICMC
    const map = L.map('map').setView([-22.0029, -47.8913], 16);

    // Camada base gratuita (OpenStreetMap)
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors'
    }).addTo(map);

    // Carrega o arquivo KML (precisa converter seu .kmz para .kml antes)
    fetch('assets/mapa/Local7.kml')
      .then(res => res.text())
      .then(kmltext => {
        const parser = new DOMParser();
        const kml = parser.parseFromString(kmltext, 'text/xml');
        const track = new (L as any).KML(kml);
        map.addLayer(track);
        map.fitBounds(track.getBounds());
      });
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
    // You can add logic here if needed, for now it's a stub to fix the error.
    // Example: Update live region message for accessibility
    this.liveRegionMessage = `Slide ${event.currentSlide + 1} ativo`;
    this.cdr.detectChanges();
  }

  embaralharArray<T>(array: T[]): T[] {
    // Algoritmo de Fisher-Yates para embaralhar o array
    const arr = array.slice();
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  }

}