import { Component, ChangeDetectionStrategy, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTabsModule } from '@angular/material/tabs';

// Interfaces para tipagem forte
export interface MembroEquipe {
  nome: string;
  funcao?: string;
  imagemUrl?: string;
  linkedinUrl?: string;
}

export interface SecaoEquipe {
  titulo: string;
  membros: MembroEquipe[];
}

@Component({
  selector: 'app-equipe',
  standalone: true,
  imports: [CommonModule, MatTabsModule],
  templateUrl: './equipe.component.html',
  styleUrls: ['./equipe.component.css'],
  // MELHORIA: Performance otimizada com OnPush
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EquipeComponent {
  
  // MELHORIA: Unificação dos dados em um único Signal estruturado.
  // Isso elimina a necessidade de criar variáveis separadas para cada ano
  // e permite um template dinâmico.
  public secoesEquipe = signal<SecaoEquipe[]>([
    {
      titulo: 'Equipe Atual',
      membros: [
        { nome: 'Júlio Cezar Estrella', funcao: 'Curador do Museu' },
        { nome: 'Gabriel Henrique dos Santos', funcao: 'Bolsista PUB - Desenvolvedor do Novo Portal' },
        { nome: 'Cassio Henrique Jorge' },
        { nome: 'Sueli Aparecida Honorio Ferreira', funcao: 'Coordenadora do Grupo Executivo' },
        { nome: 'Juliana Merlotti' },
        { nome: 'Carlos Eduardo Favaro' },
        { nome: 'Artur José Ferro Sampaio' },
        { nome: 'Marco Antonio Serafim Jacques' },
        { nome: 'Osmar Aparecido Antonio' }
      ]
    },
    {
      titulo: 'Equipe 2023 - 2024',
      membros: [
        { nome: 'Júlio Cezar Estrella', funcao: 'Curador do Museu' },
        { nome: 'Gustavo de Oliveira Martins', funcao: 'Bolsista PUB - Desenvolvedor do portal administrativo' },
        { nome: 'Sueli Aparecida Honório Ferreira', funcao: 'Coordenadora do Grupo Executivo' },
        { nome: 'Artur José Ferro Sampaio' },
        { nome: 'Carlos Eduardo Favaro' },
        { nome: 'Juliana Merlotti' },
        { nome: 'Marco Antônio Serafim Jacques' },
        { nome: 'Osmar Aparecido Antônio' } // Corrigido: estava no campo imagemUrl no original
      ]
    },
    {
      titulo: 'Equipe 2022 - 2023',
      membros: [
        { nome: 'Júlio Cezar Estrella', funcao: 'Curador do Museu' },
        { nome: 'Sueli Aparecida Honório Ferreira', funcao: 'Coordenadora do Grupo Executivo' },
        { nome: 'Amanda Kelly Durici dos Santos' },
        { nome: 'Ana Quintina de Oliveira Fernandes' },
        { nome: 'Carlos Eduardo Favaro' },
        { nome: 'João Antônio Aparecido Salla' },
        { nome: 'Juliana Merlotti' },
        { nome: 'Marco Antônio Serafim Jacques' }
      ]
    },
    {
      titulo: 'Equipe 2021 - 2022',
      membros: [
        { nome: 'Sueli Aparecida Honório Ferreira', funcao: 'Coordenadora do Grupo Executivo' },
        { nome: 'Amanda Kelly Durici dos Santos' },
        { nome: 'Ana Quintina de Oliveira Fernandes' },
        { nome: 'Carlos Eduardo Favaro' },
        { nome: 'João Antônio Aparecido Salla' },
        { nome: 'Juliana Merlotti' },
        { nome: 'Luís Roberto Peletero' },
        { nome: 'Marco Antônio Serafim Jacques' }
      ]
    },
    {
      titulo: 'Equipe 2019 - 2021',
      membros: [
        { nome: 'Sueli Aparecida Honório Ferreira', funcao: 'Coordenadora do Grupo Executivo' },
        { nome: 'Ana Quintina de Oliveira Fernandes' },
        { nome: 'Carlos Eduardo Favaro' },
        { nome: 'Juliana Merlotti' },
        { nome: 'Luís Roberto Peletero' },
        { nome: 'Marco Antônio Serafim Jacques' },
        { nome: 'Wanderley Antônio Laurindo Júnior' }
      ]
    }
  ]);

  public getIniciais(nome: string): string {
    return nome
      .trim()
      .split(/\s+/)
      .slice(0, 2)
      .map((parte) => parte.charAt(0).toUpperCase())
      .join('');
  }
}
