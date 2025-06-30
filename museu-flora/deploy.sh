#!/bin/bash

# Garante que o script pare se algum comando falhar
set -e

echo ">>> Passo 1: Parando e removendo o contêiner antigo..."
docker stop container-angular || true
docker rm container-angular || true

echo ">>> Passo 2: Reconstruindo a imagem Docker..."
docker build -t minha-app-angular .

echo ">>> Passo 3: Iniciando o novo contêiner..."
docker run --name container-angular -d -p 8080:80 minha-app-angular

echo ">>> Deploy concluído com sucesso!"
