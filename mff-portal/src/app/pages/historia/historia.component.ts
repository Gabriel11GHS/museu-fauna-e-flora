import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

interface EventoHistoria {
  ano: string;
  titulo: string;
  descricao: string;
  imagem?: string; 
}

@Component({
  selector: 'app-historia',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './historia.component.html',
  styleUrls: ['./historia.component.css']
})
export class HistoriaComponent {
  
  eventos: EventoHistoria[] = [
    {
      ano: '1971',
      titulo: 'Fundação do ICMC',
      descricao: 'O Instituto de Ciências Matemáticas e de Computação é fundado, estabelecendo as bases para futuras iniciativas de pesquisa e extensão no campus da USP em São Carlos.',
      imagem: 'assets/historia/icmc.jpg' 
    },
    {
      ano: '2013',
      titulo: 'Nasce a Brigada de Arboristas',
      descricao: 'Inspirada nas brigadas de incêndio, uma equipe pioneira de funcionários e docentes do ICMC é criada para cuidar das árvores, zelar pela segurança da comunidade e preservar o patrimônio arbóreo do campus.',
      imagem: 'assets/historia/brigada-arboristas.jpg'
    },
    {
      ano: '2014',
      titulo: 'A Semente do Museu é Plantada',
      descricao: 'A imprensa começa a divulgar a iniciativa de criar um museu a céu aberto e colaborativo no ICMC, destacando a rica fauna e flora do campus e o potencial de um acervo virtual.',
      imagem: 'assets/historia/mff-antigo.png'
    },
    {
      ano: '2016',
      titulo: 'Regimento Oficial do Museu',
      descricao: 'O Museu da Fauna e Flora do ICMC é oficialmente subordinado à Comissão de Cultura e Extensão, com seu regimento aprovado pela Congregação, consolidando sua missão de difundir o conhecimento sobre a biodiversidade local.',
      imagem: 'assets/historia/icmc-antigo.jpg'
    },
    {
      ano: '2019',
      titulo: 'Capacitação e Manejo',
      descricao: 'A segunda edição do treinamento da Brigada de Arboristas no ICMC reforça o compromisso com as boas práticas de manejo arbóreo e as ações da Seção de Áreas Verdes do campus.',
      imagem: 'assets/historia/catalogacao.jpg'
    },
    {
      ano: '2023',
      titulo: 'Projeto "Vozes da Natureza"',
      descricao: 'É lançado o projeto de extensão "Vozes da Natureza", uma iniciativa para criar um acervo digital com áudios de professores da USP, narrando histórias e curiosidades sobre as árvores do campus.',
      imagem: 'assets/historia/vozes-natureza.jpg'
    },
    {
      ano: '2025',
      titulo: 'Lançamento do Website Interativo',
      descricao: 'O website do Museu de Fauna e Flora é lançado, unindo tecnologia e natureza para oferecer ao público um catálogo digital completo, com filtros interativos, mapas e os áudios do projeto "Vozes da Natureza".',
      imagem: 'assets/logos/mff-novo5.png'
    }
  ];
}