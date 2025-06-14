import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

// Definimos uma interface para estruturar os dados de cada evento
interface EventoHistoria {
  ano: string;
  titulo: string;
  descricao: string;
  imagem?: string; // Propriedade opcional para imagem
}

@Component({
  selector: 'app-historia',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './historia.component.html',
  styleUrls: ['./historia.component.css']
})
export class HistoriaComponent {
  
  // Array com os marcos históricos do museu
  eventos: EventoHistoria[] = [
    {
      ano: '1970',
      titulo: 'Fundação do ICMC',
      descricao: 'O Instituto de Ciências Matemáticas e de Computação é fundado, estabelecendo as bases para futuras iniciativas de pesquisa e extensão no campus da USP em São Carlos.',
      imagem: 'assets/historia/icmc-antigo.jpg' // Exemplo de caminho
    },
    {
      ano: 'Década de 1980',
      titulo: 'Expansão do Campus e Plantio',
      descricao: 'Durante a expansão do campus, diversas espécies de árvores nativas e exóticas são plantadas, formando a base da coleção de flora que hoje compõe o museu a céu aberto.',
      imagem: 'assets/historia/plantio.jpg'
    },
    {
      ano: '2015',
      titulo: 'Início da Catalogação',
      descricao: 'Professores e alunos iniciam o primeiro esforço organizado para catalogar e identificar as principais espécies de árvores do campus, utilizando placas de identificação.',
      imagem: 'assets/historia/catalogacao.jpg'
    },
    {
      ano: '2023',
      titulo: 'Projeto "Vozes da Natureza"',
      descricao: 'Nasce o projeto de extensão "Vozes da Natureza", com o objetivo de criar um acervo digital com áudios de professores da USP narrando histórias e curiosidades sobre as árvores.',
      imagem: 'assets/historia/vozes-natureza.jpg'
    },
    {
      ano: '2025',
      titulo: 'Lançamento do Website',
      descricao: 'O website do Museu de Fauna e Flora é lançado, disponibilizando o catálogo completo, os áudios do projeto e informações interativas para o público geral, unindo natureza, ciência e tecnologia.',
      imagem: 'assets/historia/website-launch.jpg'
    }
  ];
}