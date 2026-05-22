# Museu da Fauna e Flora - ICMC/USP

Portal público do Museu da Fauna e Flora do ICMC/USP, campus São Carlos. O projeto apresenta informações sobre flora, fauna, história, eventos, notícias, equipe e recursos interativos do museu.

A aplicação principal é uma SPA em Angular localizada em [`mff-portal/`](mff-portal/). Em produção, ela é empacotada em Docker e servida por Nginx.

## Sumário

- [Funcionalidades](#funcionalidades)
- [Tecnologias](#tecnologias)
- [Estrutura do repositório](#estrutura-do-repositório)
- [Pré-requisitos](#pré-requisitos)
- [Como rodar localmente](#como-rodar-localmente)
- [Build](#build)
- [Deploy com Docker](#deploy-com-docker)
- [Dados, APIs e proxies](#dados-apis-e-proxies)
- [Arquivos gerados e versionamento](#arquivos-gerados-e-versionamento)
- [Comandos úteis](#comandos-úteis)

## Funcionalidades

- **Página inicial** com destaques, carrosséis e chamadas institucionais.
- **Catálogo da flora** com listagem, filtros e páginas de detalhe.
- **Catálogo da fauna** com dados locais, imagens e página de detalhe.
- **Mapa interativo** usando Leaflet/OpenStreetMap e arquivos de mapa do projeto.
- **Notícias, eventos, história, equipe e contato**.
- **Integração com webservice do museu** para dados oficiais da flora.
- **Proxy para câmeras/streams** configurado para desenvolvimento e produção.
- **Interface responsiva** para desktop e dispositivos móveis.

## Tecnologias

- [Angular](https://angular.dev/) 19
- TypeScript
- Angular Material
- RxJS
- Leaflet
- jQuery e Slick Carousel
- Docker
- Nginx

## Estrutura do repositório

```text
.
├── mff-portal/              # Aplicação Angular principal
│   ├── src/                 # Código-fonte do portal
│   │   ├── app/pages/       # Páginas/componentes principais
│   │   ├── app/services/    # Serviços de API, fauna, flora e filtros
│   │   └── assets/          # Imagens, JSONs e arquivos estáticos usados pelo Angular
│   ├── angular.json         # Configuração Angular; build sai em ../docs
│   ├── proxy.conf.json      # Proxy local para API e câmeras
│   ├── nginx.conf           # Configuração Nginx usada em produção
│   ├── Dockerfile           # Dockerfile de produção do portal
│   └── deploy.sh            # Script de deploy usado na VM
├── docs/                    # Build gerado pelo Angular; não editar manualmente
├── context/                 # Documentação/contexto local de apoio ao desenvolvimento
├── APIFLora.txt             # Anotações sobre API da flora
├── CNAME                    # Configuração de domínio, caso usado em publicação estática
└── README.md
```

> Observação: o diretório `docs/` é artefato de build. Alterações no site devem ser feitas em `mff-portal/src/` e depois compiladas novamente.

## Pré-requisitos

Para desenvolvimento local:

- Node.js 18 ou superior
- npm
- Angular CLI, opcionalmente instalado globalmente:

```bash
npm install -g @angular/cli
```

Para deploy em produção:

- Docker instalado na VM
- Permissão para criar/remover containers
- Acesso ao repositório na VM

## Como rodar localmente

Entre na aplicação Angular:

```bash
cd mff-portal
```

Instale as dependências:

```bash
npm install
```

Inicie o servidor de desenvolvimento:

```bash
npm run start
```

ou, se preferir usar o Angular CLI diretamente:

```bash
npx ng serve
```

Acesse:

```text
http://localhost:4200
```

Em desenvolvimento, o Angular usa [`mff-portal/proxy.conf.json`](mff-portal/proxy.conf.json) para encaminhar chamadas para `/api` e `/camera-feed`, evitando problemas de CORS.

## Build

O build de produção é executado dentro de `mff-portal/`:

```bash
cd mff-portal
npm run build
```

O arquivo [`mff-portal/angular.json`](mff-portal/angular.json) define:

```json
"outputPath": "../docs"
```

Por isso, a saída compilada é gerada fora da pasta Angular:

```text
docs/browser/
```

Essa pasta contém arquivos finais como `index.html`, JavaScript, CSS, imagens e outros assets. Não edite esses arquivos diretamente.

## Deploy com Docker

O deploy principal do projeto usa os arquivos dentro de `mff-portal/`:

```text
mff-portal/deploy.sh
mff-portal/Dockerfile
mff-portal/nginx.conf
mff-portal/.dockerignore
```

Fluxo do [`mff-portal/Dockerfile`](mff-portal/Dockerfile):

1. Usa `node:18-alpine` para instalar dependências e rodar `npm run build`.
2. O Angular gera o build em `/usr/src/docs/browser/`.
3. Usa `nginx:stable-alpine` como imagem final.
4. Copia o build para `/usr/share/nginx/html`.
5. Usa [`mff-portal/nginx.conf`](mff-portal/nginx.conf) para servir a SPA e configurar proxies.

Para executar o deploy na VM:

```bash
cd mff-portal
./deploy.sh
```

O script cria/recria a imagem e o container definidos nele:

```bash
IMAGE_NAME="mff-app-prod"
CONTAINER_NAME="mff-portal"
EXT_PORT="4200"
INT_PORT="80"
```

Depois do deploy, verifique o container:

```bash
docker ps
```

> Atenção: o `deploy.sh` pressupõe que ele será executado a partir da pasta `mff-portal/`, porque usa `docker build -t $IMAGE_NAME .`.

## Dados, APIs e proxies

### Flora

Os dados da flora são consumidos da API oficial do museu por meio do serviço Angular e do proxy `/api`.

Em desenvolvimento:

```text
/api -> https://mff.icmc.usp.br
```

configurado em:

```text
mff-portal/proxy.conf.json
```

Em produção, o Nginx faz o proxy reverso em:

```text
mff-portal/nginx.conf
```

### Fauna

A fauna usa arquivos locais em `src/assets`, incluindo JSONs e imagens. Para alterar dados ou assets da fauna, prefira editar os arquivos de origem dentro de:

```text
mff-portal/src/assets/
```

Depois gere um novo build.

### Câmeras/streams

O projeto possui proxy para `/camera-feed` em desenvolvimento e produção. Se mudar o servidor de câmeras, revise ambos:

```text
mff-portal/proxy.conf.json
mff-portal/nginx.conf
```

## Arquivos gerados e versionamento

O projeto possui dois `.gitignore`:

```text
.gitignore
mff-portal/.gitignore
```

Isso é esperado:

- o `.gitignore` da raiz cuida de regras gerais do repositório;
- o `.gitignore` de `mff-portal/` cuida das regras específicas do Angular.

Arquivos que normalmente não devem ser editados ou versionados manualmente:

```text
docs/
mff-portal/dist/
mff-portal/.angular/
mff-portal/node_modules/
.idea/
context/
```

Se algum arquivo gerado já estiver rastreado pelo Git, adicionar ao `.gitignore` não remove automaticamente do versionamento. Para parar de rastrear sem apagar localmente, use com cuidado:

```bash
git rm -r --cached docs .idea
```

Depois confira antes de commitar:

```bash
git status
```

## Comandos úteis

Rodar localmente:

```bash
cd mff-portal
npm install
npm run start
```

Gerar build:

```bash
cd mff-portal
npm run build
```

Rodar testes:

```bash
cd mff-portal
npm test
```

Deploy na VM:

```bash
cd mff-portal
./deploy.sh
```

Verificar estado do Git:

```bash
git status --short --branch
```

Verificar arquivos ignorados:

```bash
git status --ignored --short
```

## Observações para manutenção

- Faça alterações no código-fonte em `mff-portal/src/`, não em `docs/browser/`.
- Quando alterar endpoints ou proxies, revise desenvolvimento e produção.
- Antes de commitar, confira se não há build, cache, dependências locais ou arquivos de IDE entrando no commit.
- Não faça deploy ou push sem revisar o branch atual e o `git status`.
