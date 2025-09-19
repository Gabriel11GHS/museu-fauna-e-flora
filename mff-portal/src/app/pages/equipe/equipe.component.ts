import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface MembroEquipe {
  nome: string;
  funcao?: string;
  periodo?: string;
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
      funcao: 'Presidente do projeto',
      periodo: '2023 - Atualmente',
      imagemUrl: ''
    },
    {
      nome: 'Gabriel Henrique dos Santos',
      funcao: 'Bolsista PUB - Desenvolvedor do Novo Portal',
      periodo: '2024 - Atualmente',
      imagemUrl: ''
    },
    {
      nome: 'Cassio Henrique Jorge',
      funcao: '',
      periodo: '2013 - Atualmente',
      imagemUrl: '' 
    },
    {
      nome: 'Sueli Aparecida HonorioFerreira',
      funcao: '',
      periodo: '',
      imagemUrl: '' 
    },
    {
      nome: 'Juliana Merlotti',
      funcao: '',
      periodo: '',
      imagemUrl: '' 
    },
    {
      nome: 'Carlos Eduardo Favaro',
      funcao: '',
      periodo: '',
      imagemUrl: '' 
    },
    {
      nome: 'Artur José Ferro Sampaio',
      funcao: '',
      periodo: '',
      imagemUrl: '' 
    },
    {
      nome: 'Marco Antonio Serafim Jacques',
      funcao: '',
      periodo: '',
      imagemUrl: '' 
    },
    {
      nome: 'Osmar Aparecido Antonio',
      funcao: '',
      periodo: '',
      imagemUrl: '' 
    },
  ];

  equipesAnteriores: MembroEquipe[] = [
    {
      nome: 'Gustavo de Oliveira Martins',
      funcao: 'Bolsista PUB - Desenvolvedor do portal administrativo',
      periodo: '2023 - 2024',
      imagemUrl: ''
    },
  ];
}