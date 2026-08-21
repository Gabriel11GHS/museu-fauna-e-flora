# --- Estágio 1: Build (O Construtor) ---
# Usamos uma imagem completa do Node para ter todas as ferramentas de compilação.
FROM node:18-alpine AS build

# Define o diretório de trabalho dentro do contêiner.
WORKDIR /usr/src/app

# Copia os arquivos de definição de pacotes e instala as dependências.
COPY package*.json ./
RUN npm install

# Copia todo o resto do código do projeto.
COPY . .

# Compila a aplicação para produção.
# Baseado no seu angular.json, isto criará uma pasta em /usr/src/docs.
RUN npm run build

RUN echo "--- Listando o conteúdo de /usr/src ---"
RUN ls -R /usr/src
# --- Estágio 2: Produção (O Servidor Final) ---
# Usamos uma imagem minúscula e oficial do Nginx.
FROM nginx:stable-alpine

# Origem interna padrao do backend CodeIgniter. No deploy, sobrescreva
# BACKEND_CODEIGNITER se o PHP estiver em outro host/porta.
ENV BACKEND_CODEIGNITER=http://host.docker.internal

# Copia os arquivos da pasta /usr/src/docs para a pasta onde o Nginx serve os sites.
COPY --from=build /usr/src/docs/browser/ /usr/share/nginx/html

# A imagem oficial do Nginx renderiza templates com envsubst no startup.
COPY nginx.conf /etc/nginx/templates/default.conf.template

# Expõe a porta 80, que é a porta padrão que o Nginx usa.
EXPOSE 80

# Comando padrão para iniciar o servidor Nginx.
CMD ["nginx", "-g", "daemon off;"]
