import requests
import json

API_URL = 'https://mff.icmc.usp.br/Webservice/listarIndividuos'

LOCAL_FILTRADO = 'Local 2'

def gerar_tabela_checklist():
    """
    Busca os dados da API, filtra pelo local desejado e gera uma tabela
    em formato Markdown para a checklist de campo.
    """
    try:
        # 1. Faz a requisição HTTP para a API
        response = requests.get(API_URL)
        # Verifica se a requisição foi bem-sucedida (código 200)
        response.raise_for_status() 
        # 2. Converte a resposta JSON para um dicionário Python
        dados_flora = response.json()
        
    except requests.exceptions.RequestException as e:
        print(f"Erro ao buscar dados da API: {e}")
        return None
    except json.JSONDecodeError:
        print("Erro: A resposta da API não é um JSON válido.")
        return None

    # 3. Filtra os indivíduos pelo local especificado
    individuos_local_filtrado = [p for p in dados_flora if p.get('nomeLocal') == LOCAL_FILTRADO]

    if not individuos_local_filtrado:
        print(f"Nenhum indivíduo encontrado para o '{LOCAL_FILTRADO}'.")
        return ""

    # 4. Monta o cabeçalho da tabela
    tabela = f"# Checklist de Indivíduos - {LOCAL_FILTRADO}\n\n"
    tabela += "| ID | Nome Popular | Nome Científico | Família | Suprimido? | Espécie correta? | Obs. |\n"
    tabela += "|----|--------------|-----------------|---------|------------|------------------|------|\n"

    # 5. Preenche as linhas da tabela com os dados filtrados
    for planta in individuos_local_filtrado:
        tem_foto = "Sim" if planta.get('fotoIndividuo') or planta.get('fotoTaxonomia') else "Não"
        tem_audio = "Sim" if planta.get('trilhaAudio') else "Não"
        
        # Limpa possíveis quebras de linha no nome científico
        nome_cientifico = (planta.get('nomeCientifico') or '*').replace('\n', ' ')

        linha = (
            f"| {planta.get('idIndividuo')} "
            f"| {planta.get('nomePopular') or '*'} "
            f"| {nome_cientifico} "
            f"| {planta.get('familia') or '*'} "
            "| [ ] Sim [ ] Não " # Suprimido
            f"| {tem_audio} "
            ""  # Checklist para preenchimento manual
            "| "                 # Espaço para observações
            "|\n"
        )
        tabela += linha
        
    return tabela

# --- Execução do Script ---
if __name__ == "__main__":
    tabela_markdown = gerar_tabela_checklist()
    if tabela_markdown:
        # Imprime a tabela no console
        print(tabela_markdown)
        
        # Opcional: Salva a tabela em um arquivo .md
        with open(f'checklist_{LOCAL_FILTRADO.replace(" ", "_")}.md', 'w', encoding='utf-8') as f:
            f.write(tabela_markdown)
        print(f"\nArquivo 'checklist_{LOCAL_FILTRADO.replace(' ', '_')}.md' gerado com sucesso.")