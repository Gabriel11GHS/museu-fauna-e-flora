FROM node:18-alpine
WORKDIR /usr/src/app

COPY package*.json ./
ENV NODE_ENV=development
RUN npm install
RUN npm install -g @angular/cli

# certifica-se de copiar também o vite.config.js
COPY vite.config.js ./
COPY . .

EXPOSE 4200
ENTRYPOINT []
CMD ["npm", "run", "start"]

