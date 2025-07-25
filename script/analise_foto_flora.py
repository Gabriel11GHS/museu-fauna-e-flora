import requests
import json

def analisar_fotos_flora_api(url):

    try:
        # Faz a requisição GET para a URL da API
        response = requests.get(url)
        # Verifica se a requisição foi bem-sucedida (código de status 200)
        response.raise_for_status()
        
        # Carrega o conteúdo da resposta como JSON
        dados_flora = response.json()

    except requests.exceptions.RequestException as e:
        print(f"Erro ao fazer a requisição para a API: {e}")
        return
    except json.JSONDecodeError:
        print("Erro: A resposta da API não contém um JSON válido.")
        return
    except Exception as e:
        print(f"Ocorreu um erro inesperado: {e}")
        return

    # Contadores e listas para armazenar os resultados
    com_foto = 0
    sem_foto = 0
    individuos_sem_foto = []

    # Itera sobre cada indivíduo (planta) nos dados
    for individuo in dados_flora:
        # Verifica se o campo 'fotoIndividuo' existe, não é nulo e não está vazio
        if individuo.get('fotoIndividuo'):
            com_foto += 1
        else:
            sem_foto += 1
            # Adiciona o nome e o ID à lista de indivíduos sem foto
            nome = individuo.get('nomePopular') or 'Nome não disponível'
            id_individuo = individuo.get('idIndividuo')
            individuos_sem_foto.append(f"ID: {id_individuo}, Nome: {nome}")

    # Imprime o relatório final
    print("--- Análise de Fotos dos Indivíduos da Flora (via API) ---")
    print(f"\nTotal de indivíduos analisados: {len(dados_flora)}")
    print(f"Indivíduos COM foto específica: {com_foto}")
    print(f"Indivíduos SEM foto específica: {sem_foto}")

    if individuos_sem_foto:
        print("\n--- Lista de Indivíduos Sem Foto Específica ---")
        for item in individuos_sem_foto:
            print(item)
    else:
        print("\nTodos os indivíduos possuem uma foto específica!")

# --- Execução do Script ---
# URL da API de indivíduos
url_api_flora = 'https://mff.icmc.usp.br/Webservice/listarIndividuos'
analisar_fotos_flora_api(url_api_flora)