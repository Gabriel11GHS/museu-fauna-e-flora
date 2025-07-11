# Versão 1: Imagem de desenvolvimento
FROM node:18-alpine

WORKDIR /usr/src/app

# Copia primeiro o package.json e package-lock.json para aproveitar o cache do Docker
COPY package*.json ./

# Instala as dependências
RUN npm install

# Copia o restante do código da aplicação
COPY . .

# Expõe a porta que o ng serve irá usar
EXPOSE 4200

# Define o comando que será executado quando o contêiner iniciar
ENTRYPOINT ["npm", "run", "start"]
