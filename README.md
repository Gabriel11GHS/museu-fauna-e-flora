# 🏛️ Museu da Fauna e Flora - ICMC/USP

Este é o repositório do projeto de extensão para a criação do website do Museu de Fauna e Flora do Instituto de Ciências Matemáticas e de Computação (ICMC) da USP, campus de São Carlos. O objetivo é criar uma plataforma digital interativa para catalogar e apresentar as espécies de flora presentes no campus para o público geral.

O site oferece uma experiência virtual, permitindo que os visitantes explorem as árvores e plantas do local, acessem informações detalhadas, vejam fotos e ouçam áudios explicativos gravados por professores da USP no âmbito do projeto "Vozes da Natureza".

![Captura de tela da página de listagem da flora](https://github.com/gabriel11ghs/museu-fauna-e-flora/assets/112695594/8040af04-7c22-446f-a6a9-8588820c7cc4)


## ✨ Funcionalidades Principais

- **Catálogo da Flora:** Galeria de cards com todas as espécies de plantas catalogadas no campus.
- **Busca e Filtragem:** Ferramentas para filtrar as plantas por local, família ou buscar por nome popular e científico.
- **Página de Detalhes:** Visualização completa de cada planta, com fotos, áudios, nome, família, local e ano de plantio.
- **API Integration:** Os dados das plantas são consumidos em tempo real a partir do webservice do museu.
- **Design Responsivo:** Interface adaptada para uma boa experiência tanto em desktops quanto em dispositivos móveis.

## 🚀 Tecnologias Utilizadas

- **[Angular](https://angular.io/) (v19+):** Framework principal para a construção da interface.
- **[TypeScript](https://www.typescriptlang.org/):** Superset do JavaScript que adiciona tipagem estática.
- **[Angular Material](https://material.angular.io/):** Biblioteca de componentes de UI para um design moderno e consistente.
- **[Slick Carousel](https://kenwheeler.github.io/slick/):** Utilizado na página inicial para a exibição de mídias em carrossel.
- **CSS Grid & Flexbox:** Para a criação de layouts responsivos e organizados.

## 📋 Pré-requisitos

Antes de começar, garanta que você tenha o [Node.js](https://nodejs.org/) instalado em sua máquina (versão 18 ou superior é recomendada). A instalação do Node.js também inclui o `npm` (gerenciador de pacotes).

Você também precisará do **Angular CLI** instalado globalmente. Se não o tiver, instale com o comando:
```bash
npm install -g @angular/cli
