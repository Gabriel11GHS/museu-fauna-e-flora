import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SlickCarouselModule } from 'ngx-slick-carousel';
import { trigger, transition, style, animate } from '@angular/animations';
import { MatButtonModule } from '@angular/material/button'; // Para botões estilizados
import { MatIconModule } from '@angular/material/icon';     // Para ícones
import { RouterLink } from '@angular/router';               // Para navegação

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    SlickCarouselModule,
    MatButtonModule,
    MatIconModule
  ],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  animations: [
    trigger('fadeIn', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('1s ease-out', style({ opacity: 1 }))
      ])
    ])
  ]
})
export class HomeComponent implements OnInit { 
  
  // Imagens para o carrossel principal
  mediaItems = [
    { image: 'assets/home/carrossel-1.jpg', alt: 'Vista do campus do ICMC' },
    { image: 'assets/home/carrossel-2.jpg', alt: 'Detalhe de uma flor de Ipê Amarelo' },
    { image: 'assets/home/carrossel-3.jpg', alt: 'Capivara no gramado da USP' }
  ];

  // Configurações do Slick Carousel
  slideConfig = {
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 4000,
    dots: true,
    arrows: true,
    infinite: true,
    fade: true,
    cssEase: 'linear'
  };
  
  // Destaques para os cards de navegação
  destaques = [
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
      link: '/fauna' // Ajuste o link se for diferente
    },
    {
      icone: 'map',
      titulo: 'Mapa Interativo',
      descricao: 'Localize as espécies e explore os diferentes ambientes do instituto.',
      link: '/mapa' // Ajuste o link se for diferente
    }
  ];

  ngOnInit(): void {
    // Lógica adicional, se necessária
  }
}