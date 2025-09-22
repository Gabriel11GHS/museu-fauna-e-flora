import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface MembroEquipe {
  nome: string;
  funcao?: string;
  imagemUrl?: string;
}

@Component({
  selector: 'app-equipe',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './equipe.component.html',
  styleUrls: ['./equipe.component.css']
})
export class EquipeComponent {
  equipeAtual: MembroEquipe[] = [
    {
      nome: 'Júlio Cezar Estrella',
      funcao: 'Curador do Museu',
      imagemUrl: ''
    },
    {
      nome: 'Gabriel Henrique dos Santos',
      funcao: 'Bolsista PUB - Desenvolvedor do Novo Portal',
      imagemUrl: ''
    },
    {
      nome: 'Cassio Henrique Jorge',
      funcao: '',
      imagemUrl: ''
    },
    {
      nome: 'Sueli Aparecida HonorioFerreira',
      funcao: 'Coordenadora do Grupo Executivo',
      imagemUrl: ''
    },
    {
      nome: 'Juliana Merlotti',
      funcao: '',
      imagemUrl: ''
    },
    {
      nome: 'Carlos Eduardo Favaro',
      funcao: '',
      imagemUrl: ''
    },
    {
      nome: 'Artur José Ferro Sampaio',
      funcao: '',
      imagemUrl: ''
    },
    {
      nome: 'Marco Antonio Serafim Jacques',
      funcao: '',
      imagemUrl: ''
    },
    {
      nome: 'Osmar Aparecido Antonio',
      funcao: '',
      imagemUrl: ''
    },
  ];

  equipe23_24: MembroEquipe[] = [
    {
      nome: 'Júlio Cezar Estrella',
      funcao: 'Curador do Museu',
      imagemUrl: ''
    },
    {
      nome: 'Gustavo de Oliveira Martins',
      funcao: 'Bolsista PUB - Desenvolvedor do portal administrativo',
      imagemUrl: ''
    },
    {
      nome: 'Sueli Aparecida Honório Ferreira',
      funcao: 'Coordenadora do Grupo Executivo',
      imagemUrl: ''
    },
    {
      nome: 'Artur José Ferro Sampaio',
      funcao: '',
      imagemUrl: ''
    },
    {
      nome: 'Carlos Eduardo Favaro',
      funcao: '',
      imagemUrl: ''
    },
    {
      nome: 'Juliana Merlotti',
      funcao: '',
      imagemUrl: ''
    },
    {
      nome: 'Marco Antônio Serafim Jacques',
      funcao: '',
      imagemUrl: ''
    },
    {
      nome: 'Marco Antônio Serafim Jacques',
      funcao: '',
      imagemUrl: 'Osmar Aparecido Antônio'
    },
  ];

  equipe22_23: MembroEquipe[] = [
    {
      nome: 'Júlio Cezar Estrella',
      funcao: 'Curador do projeto',
      imagemUrl: ''
    },
    {
      nome: 'Sueli Aparecida Honório Ferreira',
      funcao: 'Coordenadora do Grupo Executivo',
      imagemUrl: ''
    },
    {
      nome: 'Amanda Kelly Durici dos Santos',
      funcao: '',
      imagemUrl: ''
    },
    {
      nome: 'Ana Quintina de Oliveira Fernandes',
      funcao: '',
      imagemUrl: ''
    },
    {
      nome: 'Carlos Eduardo Favaro',
      funcao: '',
      imagemUrl: ''
    },
    {
      nome: 'João Antônio Aparecido Salla',
      funcao: '',
      imagemUrl: ''
    },
    {
      nome: 'Juliana Merlotti',
      funcao: '',
      imagemUrl: ''
    },
    {
      nome: 'Marco Antônio Serafim Jacques',
      funcao: '',
      imagemUrl: ''
    },
  ];

  equipe21_22: MembroEquipe[] = [
    {
      nome: 'Sueli Aparecida Honório Ferreira',
      funcao: 'Coordenadora do Grupo Executivo',
      imagemUrl: ''
    },
    {
      nome: 'Amanda Kelly Durici dos Santos',
      funcao: '',
      imagemUrl: ''
    },
    {
      nome: 'Ana Quintina de Oliveira Fernandes',
      funcao: '',
      imagemUrl: ''
    },
    {
      nome: 'Carlos Eduardo Favaro',
      funcao: '',
      imagemUrl: ''
    },
    {
      nome: 'João Antônio Aparecido Salla',
      funcao: '',
      imagemUrl: ''
    },
    {
      nome: 'Juliana Merlotti',
      funcao: '',
      imagemUrl: ''
    },
    {
      nome: 'Luís Roberto Peletero',
      funcao: '',
      imagemUrl: ''
    },
    {
      nome: 'Marco Antônio Serafim Jacques',
      funcao: '',
      imagemUrl: ''
    },
  ];

  equipe19_21: MembroEquipe[] = [
    {
      nome: 'Sueli Aparecida Honório Ferreira',
      funcao: 'Coordenadora do Grupo Executivo',
      imagemUrl: ''
    },
    {
      nome: 'Ana Quintina de Oliveira Fernandes',
      funcao: '',
      imagemUrl: ''
    },
    {
      nome: 'Carlos Eduardo Favaro',
      funcao: '',
      imagemUrl: ''
    },
    {
      nome: 'Juliana Merlotti',
      funcao: '',
      imagemUrl: ''
    },
    {
      nome: 'Luís Roberto Peletero',
      funcao: '',
      imagemUrl: ''
    },
    {
      nome: 'Marco Antônio Serafim Jacques',
      funcao: '',
      imagemUrl: ''
    },
    {
      nome: 'Wanderley Antônio Laurindo Júnior',
      funcao: '',
      imagemUrl: ''
    },

  ];
}