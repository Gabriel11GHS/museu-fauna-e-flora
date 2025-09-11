import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

interface EventoHistoria {
  ano: string;
  titulo: string;
  descricao: string;
  imagem?: string; 
  link?: string;
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
      imagem: 'assets/historia/1971-FundacaoIcmc.jpg' 
    },
    {
      ano: '2004',
      titulo: 'Lançamento do Projeto "Memória Virtual"',
      descricao: 'Início do projeto "Memória Virtual", liderado pelos professores José Carlos Maldonado, Elisa Yumi Nakagawa e Thiago Bianchi do ICMC-USP. A iniciativa de criar um sistema para catalogar acervos históricos serviu como uma importante inspiração para a concepção do nosso museu digital.',
      imagem: 'assets/historia/2004-memoria-virtual.png',
      link: 'https://napsol.icmc.usp.br/pt-br/node/111.html'
    },
    {
      ano: '2013',
      titulo: 'Nasce a Brigada de Arboristas',
      descricao: 'Inspirada nas brigadas de incêndio, uma equipe pioneira de funcionários e docentes do ICMC é criada para cuidar das árvores, zelar pela segurança da comunidade e preservar o patrimônio arbóreo do campus.',
      imagem: 'assets/historia/2013-Brigadadearboristas.png',
      link: 'https://www5.usp.br/noticias/meio-ambiente/icmc-forma-primeira-brigada-de-arboristas-da-usp/'
    },
    {
      ano: '2013',
      titulo: 'ICMC Lança Projeto para Criar Museu da Fauna e da Flora',
      descricao: 'O ICMC lança um projeto inédito para catalogar todas as espécies de sua fauna e flora, com o objetivo de criar um museu virtual para disponibilizar as informações para a comunidade.',
      imagem: 'assets/historia/2014-mffantigo.png',
      link: 'https://www.icmc.usp.br/noticias/1379-catalogacao-de-especies-icmc-lanca-projeto-para-criar-museu-da-fauna-e-da-flora'
    },
    {
      ano: '2016',
      titulo: 'Regimento Oficial do Museu',
      descricao: 'O Museu da Fauna e Flora do ICMC é oficialmente subordinado à Comissão de Cultura e Extensão, com seu regimento aprovado pela Congregação, consolidando sua missão de difundir o conhecimento sobre a biodiversidade local.',
      imagem: 'assets/historia/2016-Regimento.png',
      link: 'https://drive.google.com/file/d/1SeYHwLaSuu2lPEUrmIUJrJLNAZKD6U8D/view?usp=drive_link'
    },
    {
      ano: '2017',
      titulo: 'Museu a Céu Aberto na Mídia',
      descricao: 'O Jornal da USP destaca a iniciativa do ICMC, que transformou o campus em um museu a céu aberto. A matéria ressalta a catalogação de mais de 50 espécies arbóreas e o desenvolvimento de um aplicativo para visitação virtual, consolidando a visibilidade do projeto.',
      imagem: 'assets/historia/2017-JornalUSP.png',
      link: 'https://jornal.usp.br/universidade/diversidade-de-especies-faz-de-sao-carlos-um-museu-a-ceu-aberto/'
    },
    {
      ano: '2023',
      titulo: 'Projeto "Vozes da Natureza"',
      descricao: 'É lançado o projeto de extensão "Vozes da Natureza", uma iniciativa para criar um acervo digital com áudios de professores da USP, narrando histórias e curiosidades sobre as árvores do campus.',
      imagem: 'assets/historia/2023-VozesNatureza.png'  
    },
    {
      ano: '2025',
      titulo: 'Lançamento do Portal público do Museu',
      descricao: 'O portal do Museu de Fauna e Flora é lançado, unindo tecnologia e natureza para oferecer ao público interação com o acervo vivo que há no instituto.',
      imagem: 'assets/logos/mff-novo.png'
    }
  ];
}