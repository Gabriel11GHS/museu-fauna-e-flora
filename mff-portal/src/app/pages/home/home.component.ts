import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { SlickCarouselModule } from 'ngx-slick-carousel';
import { forkJoin, Observable, of } from 'rxjs'; 
import { catchError, map } from 'rxjs/operators';
import { ApiService, Planta } from '../../services/api.service';
import { FaunaService } from '../../services/fauna.service';
import { Animal } from '../../models/animal.model';

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
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HomeComponent implements OnInit {
  
  public destaques$!: Observable<Destaque[]>;

  // Configurações do Carrossel da seção Hero
  mediaItems = [
    { image: 'assets/home/carrossel-1.jpg', alt: 'Vista do campus do ICMC' },
    { image: 'assets/home/carrossel-2.jpg', alt: 'Detalhe de uma flor de Ipê Amarelo' },
    { image: 'assets/home/carrossel-3.jpg', alt: 'Capivara no gramado da USP' }
  ];

  slideConfig = {
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 4000,
    dots: true,
    arrows: false, // Setas desabilitadas para um visual mais limpo
    infinite: true,
    fade: true,
    cssEase: 'linear'
  };
  
  // ====================================================================
  // A PROPRIEDADE QUE FALTAVA ESTÁ AQUI:
  // ====================================================================
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
    private faunaService: FaunaService
  ) {}

  ngOnInit(): void {
    // A lógica dos destaques aleatórios continua a mesma
    this.destaques$ = forkJoin({
      plantas: this.apiService.getPlantas().pipe(catchError(() => of([]))), // Fallback em caso de erro
      animais: this.faunaService.getAnimais().pipe(catchError(() => of([])))  // Fallback em caso de erro
    }).pipe(
      map(({ plantas, animais }) => {
        const destaquesFlora: Destaque[] = plantas
          .filter(p => p.fotoIndividuo || p.fotoTaxonomia)
          .map(planta => ({
            nome: planta.nomePopular || 'Planta não identificada',
            imagem: planta.fotoIndividuo! || planta.fotoTaxonomia!,
            tipo: 'Flora',
            link: `/flora/${planta.idIndividuo}`
          }));

        const destaquesFauna: Destaque[] = animais.map(animal => ({
          nome: animal.nomePopular,
          imagem: animal.imagem || 'assets/default-fauna.jpg',
          tipo: 'Fauna',
          link: `/fauna`
        }));
        
        const combinados = [...destaquesFlora, ...destaquesFauna];
        return this.embaralharArray(combinados).slice(0, 8);
      })
    );
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