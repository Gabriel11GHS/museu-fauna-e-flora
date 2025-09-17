#!/bin/bash

# Script para automatizar o deploy de uma aplicação Angular com Docker.
# Este script atualiza o código, reconstrói a imagem Docker e reinicia o contêiner.

# --- Configuração ---
# Nome que você quer dar para a sua imagem Docker.
IMAGE_NAME="mff-app-prod"
# Nome que você quer dar para o seu contêiner em execução.
CONTAINER_NAME="mff-portal"
# Porta externa (na VM) que será usada para acessar o site.
EXT_PORT="4200"
# Porta interna (do Nginx dentro do contêiner) que a porta externa vai se conectar.
INT_PORT="80"

# --- Início do Script ---

# O comando 'set -e' faz com que o script pare imediatamente se algum comando falhar.
set -e

echo "🚀 Iniciando o processo de deploy..."

# 1. Atualizar o Código-Fonte
echo "➡️  Passo 1/4: Puxando as últimas alterações do repositório Git..."

echo "✅ Código-fonte atualizado com sucesso."
echo ""

# 2. Reconstruir a Imagem Docker
# Usa o Dockerfile na pasta atual para construir uma nova versão da imagem.
echo "➡️  Passo 2/4: Reconstruindo a imagem Docker ($IMAGE_NAME)..."
docker build -t $IMAGE_NAME .
echo "✅ Imagem Docke   r reconstruída com sucesso."
echo ""

# 3. Parar e Remover o Contêiner Antigo
# Usamos '|| true' para que o script não pare com erro se o contêiner não existir.
echo "➡️  Passo 3/4: Parando e removendo o contêiner antigo ($CONTAINER_NAME)..."
docker stop $CONTAINER_NAME || true
docker rm $CONTAINER_NAME || true
echo "✅ Limpeza concluída."
echo ""

# 4. Iniciar o Novo Contêiner
# Inicia um novo contêiner a partir da imagem recém-criada.
echo "➡️  Passo 4/4: Iniciando o novo contêiner..."
docker run --restart unless-stopped --name $CONTAINER_NAME -d -p $EXT_PORT:$INT_PORT $IMAGE_NAME
echo ""

# --- Fim do Script ---
echo "🎉 Deploy concluído com sucesso!"
echo "✅ O seu site está no ar."
echo "Verifique o status com o comando: docker ps"
