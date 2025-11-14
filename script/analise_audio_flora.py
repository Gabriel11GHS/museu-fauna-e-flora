#!/usr/bin/env python
# -*- coding: utf-8 -*-

"""
Script para consumir a API do MFF, listar as ESPÉCIES (Taxonomia)
únicas que ainda não possuem áudio e salvar o resultado em um
arquivo CSV.
"""

import requests
import csv  # Importa o módulo para manipulação de CSV
from tabulate import tabulate

# URL direta da API
API_URL = "https://mff.icmc.usp.br/Webservice/listarIndividuos"
# Nome do arquivo de saída
OUTPUT_FILE = "especies_sem_audio.csv"

def limpar_nome(nome_api):
    """
    Limpa o nome da planta, replicando a lógica do ApiService do Angular.
    (trata None, strings vazias ou '*')
    """
    if not nome_api or nome_api == '*':
        return 'Não identificado'
    return nome_api.strip()

def processar_dados_por_especie(dados_brutos):
    """
    Processa a lista de INDIVÍDUOS e agrupa por ESPÉCIE (idTaxonomia),
    verificando se ALGUM indivíduo daquela espécie possui áudio.
    """
    
    # Dicionário para rastrear o status de cada espécie (taxonomia)
    status_especies = {}

    for individuo in dados_brutos:
        tax_id = individuo.get('idTaxonomia')
        nome_popular = limpar_nome(individuo.get('nomePopular'))
        
        # Ignoramos indivíduos sem taxonomia ou não identificados
        if not tax_id or nome_popular == 'Não identificado':
            continue

        audio_presente = bool(individuo.get('trilhaAudio'))

        if tax_id not in status_especies:
            status_especies[tax_id] = {
                'nomePopular': nome_popular,
                'nomeCientifico': limpar_nome(individuo.get('nomeCientifico')),
                'temAudio': audio_presente
            }
        else:
            # Se já encontramos um áudio para esta espécie, ela sempre terá 'temAudio: True'
            if audio_presente and not status_especies[tax_id]['temAudio']:
                status_especies[tax_id]['temAudio'] = True

    # Agora, separamos as espécies
    especies_com_audio = []
    especies_sem_audio = []
    
    for tax_id, dados in status_especies.items():
        item_legivel = {
            'ID Taxonomia': tax_id,
            'Nome Popular': dados['nomePopular'],
            'Nome Científico': dados['nomeCientifico']
        }
        
        if dados['temAudio']:
            especies_com_audio.append(item_legivel)
        else:
            especies_sem_audio.append(item_legivel)

    return especies_com_audio, especies_sem_audio

def salvar_csv(dados, nome_arquivo):
    """
    Salva a lista de dicionários em um arquivo CSV.
    """
    if not dados:
        print("\nNenhuma espécie sem áudio para salvar.")
        return

    # Pega os cabeçalhos (chaves) do primeiro dicionário da lista
    headers = dados[0].keys()
    
    print(f'\n💾 Salvando relatório em "{nome_arquivo}"...')
    
    try:
        with open(nome_arquivo, 'w', newline='', encoding='utf-8') as f:
            # Cria um "escritor" de CSV baseado em dicionários
            writer = csv.DictWriter(f, fieldnames=headers)
            
            # Escreve a linha de cabeçalho
            writer.writeheader()
            
            # Escreve todas as linhas de dados
            writer.writerows(dados)
            
        print(f'✅ Relatório salvo com sucesso!')
        
    except IOError as e:
        print(f"❌ Erro ao salvar o arquivo CSV: {e}")
    except Exception as e:
        print(f"❌ Erro inesperado ao escrever o CSV: {e}")

def main():
    """ Função principal do script """
    print('🔎 Buscando dados de todos os indivíduos na API...')
    
    try:
        response = requests.get(API_URL, timeout=15)
        response.raise_for_status()
        
        dados_brutos = response.json()
        print(f"✅ {len(dados_brutos)} indivíduos encontrados. Analisando por espécie...")

        # Processa e agrupa os dados
        com_audio, sem_audio = processar_dados_por_especie(dados_brutos)
        
        total = len(com_audio) + len(sem_audio)

        # Imprime o relatório no console
        print('\n--- 🎧 Relatório "Vozes da Natureza" (por Espécie) ---')
        print(f'Total de espécies únicas (identificadas): {total}')
        print(f'Espécies COM áudio (pelo menos 1): {len(com_audio)}')
        print(f'Espécies SEM áudio (nenhum indivíduo): {len(sem_audio)}')
        print('------------------------------------------------------\n')

        if sem_audio:
            print('📋 Lista de ESPÉCIES com áudio faltante:\n')
            print(tabulate(sem_audio, headers="keys", tablefmt="grid"))
            
            # Chama a função para salvar o CSV
            salvar_csv(sem_audio, OUTPUT_FILE)
        else:
            print('🎉 Ótima notícia! Todas as espécies identificadas possuem ao menos um áudio.')

    except requests.exceptions.RequestException as e:
        print(f'❌ Erro ao buscar dados da API: {e}')
    except Exception as e:
        print(f'❌ Ocorreu um erro inesperado: {e}')

# Ponto de entrada do script
if __name__ == "__main__":
    main()