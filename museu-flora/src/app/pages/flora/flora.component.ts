// src/app/pages/flora/flora.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

// Define a interface para os dados da planta
interface Planta {
  idIndividuo: string;
  anoPlantio: string | null;
  trilhaAudio: string | null;
  fotoIndividuo: string | null;
  idTaxonomia: string;
  nomePopular: string | null;
  nomeCientifico: string | null;
  familia: string | null;
  fotoTaxonomia: string | null;
  idLocal: string;
  nomeLocal: string;
}

@Component({
  selector: 'app-flora',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule],
  templateUrl: './flora.component.html',
  styleUrls: ['./flora.component.css']
})
export class FloraComponent implements OnInit {
  selectedLocal: string = '';
  searchTerm: string = '';
  selectedFamilia: string = '';

  allPlantas: Planta[] = []; // Armazena todas as plantas carregadas
  data: Planta[] = []; // Armazena as plantas filtradas para exibição
  errorMessage: string | null = null;

  locais: string[] = []; // Para popular o dropdown de locais
  familias: string[] = []; // Para popular o dropdown de famílias

  // Dados simulados da API (conteúdo de APIFlora.txt)
  // Em uma aplicação real, você faria uma requisição HTTP para obter esses dados.
  private apiFloraData: Planta[] = [{"idIndividuo":"1","anoPlantio":"0","trilhaAudio":null,"fotoIndividuo":null,"idTaxonomia":"17","nomePopular":"Sibipiruna","nomeCientifico":"Caesalpinia pluviosa DC.","familia":"Fabaceae","fotoTaxonomia":null,"idLocal":"1","nomeLocal":"Local 1"},{"idIndividuo":"2","anoPlantio":"0","trilhaAudio":null,"fotoIndividuo":null,"idTaxonomia":"17","nomePopular":"Sibipiruna","nomeCientifico":"Caesalpinia pluviosa DC.","familia":"Fabaceae","fotoTaxonomia":null,"idLocal":"1","nomeLocal":"Local 1"},{"idIndividuo":"3","anoPlantio":"0","trilhaAudio":null,"fotoIndividuo":null,"idTaxonomia":"17","nomePopular":"Sibipiruna","nomeCientifico":"Caesalpinia pluviosa DC.","familia":"Fabaceae","fotoTaxonomia":null,"idLocal":"1","nomeLocal":"Local 1"},{"idIndividuo":"4","anoPlantio":"0","trilhaAudio":null,"fotoIndividuo":null,"idTaxonomia":"17","nomePopular":"Sibipiruna","nomeCientifico":"Caesalpinia pluviosa DC.","familia":"Fabaceae","fotoTaxonomia":null,"idLocal":"1","nomeLocal":"Local 1"},{"idIndividuo":"5","anoPlantio":"0","trilhaAudio":null,"fotoIndividuo":null,"idTaxonomia":"17","nomePopular":"Sibipiruna","nomeCientifico":"Caesalpinia pluviosa DC.","familia":"Fabaceae","fotoTaxonomia":null,"idLocal":"1","nomeLocal":"Local 1"},{"idIndividuo":"6","anoPlantio":"0","trilhaAudio":null,"fotoIndividuo":null,"idTaxonomia":"17","nomePopular":"Sibipiruna","nomeCientifico":"Caesalpinia pluviosa DC.","familia":"Fabaceae","fotoTaxonomia":null,"idLocal":"1","nomeLocal":"Local 1"},{"idIndividuo":"7","anoPlantio":"0","trilhaAudio":".\/upload\/013-Eucalipto.mp3","fotoIndividuo":null,"idTaxonomia":"2","nomePopular":"Eucalipto","nomeCientifico":"Eucalyptus globulus Labill.","familia":"Myrtaceae","fotoTaxonomia":".\/upload\/7Foto.jpg","idLocal":"1","nomeLocal":"Local 1"},{"idIndividuo":"8","anoPlantio":"0","trilhaAudio":null,"fotoIndividuo":null,"idTaxonomia":"1","nomePopular":null,"nomeCientifico":null,"familia":null,"fotoTaxonomia":null,"idLocal":"1","nomeLocal":"Local 1"},{"idIndividuo":"9","anoPlantio":null,"trilhaAudio":null,"fotoIndividuo":null,"idTaxonomia":"3","nomePopular":"Ip\u00ea Roxo","nomeCientifico":"Handroanthus impetiginosus (Mart. Ex DC.) Mattos","familia":"Bignoniaceae","fotoTaxonomia":null,"idLocal":"1","nomeLocal":"Local 1"},
    // ... (O restante do conteúdo JSON de APIFlora.txt seria colado aqui)
    // Por questões de brevidade, o conteúdo completo não está replicado aqui, mas deve ser incluído.
    // Exemplo de como o final do array seria:
    {"idIndividuo":"453","anoPlantio":"0","trilhaAudio":null,"fotoIndividuo":null,"idTaxonomia":"78","nomePopular":"Chap\u00e9u-de-napole\u00e3o","nomeCientifico":"Thevetia peruviana","familia":"\tApocynaceae","fotoTaxonomia":null,"idLocal":"5","nomeLocal":"Local 5"}];

  constructor(private http: HttpClient) { }

  ngOnInit(): void {
    this.carregarPlantas();
  }

  carregarPlantas(): void {
    // Simula o carregamento de dados. Substitua por this.http.get<Planta[]>('URL_DA_SUA_API/APIFLora.txt') em um cenário real.
    of(this.apiFloraData)
      .pipe(
        map(plantas => plantas.map(planta => ({ // Trata valores nulos ou '*'
          ...planta,
          nomePopular: (planta.nomePopular === '*' || planta.nomePopular === null) ? 'Não identificado' : planta.nomePopular,
          nomeCientifico: (planta.nomeCientifico === '*' || planta.nomeCientifico === null) ? 'Não identificado' : planta.nomeCientifico,
          familia: (planta.familia === '*' || planta.familia === null) ? 'Não identificada' : planta.familia?.trim(), // .trim() para remover espaços extras como em "\tApocynaceae"
        }))),
        catchError(error => {
          console.error('Erro ao carregar dados das plantas:', error);
          this.errorMessage = 'Não foi possível carregar os dados das plantas. Tente novamente mais tarde.';
          return of([]); // Retorna um array vazio em caso de erro
        })
      )
      .subscribe(plantas => {
        this.allPlantas = plantas;
        this.extractFilterOptions();
        this.filtrarPlantas(); // Aplica filtros iniciais (ou exibe todos)
      });
  }

  extractFilterOptions(): void {
    const locaisSet = new Set<string>();
    const familiasSet = new Set<string>();

    this.allPlantas.forEach(planta => {
      if (planta.nomeLocal) {
        locaisSet.add(planta.nomeLocal);
      }
      // Adiciona à lista de famílias apenas se não for "Não identificada" e existir
      if (planta.familia && planta.familia !== 'Não identificada') {
        familiasSet.add(planta.familia);
      }
    });

    this.locais = Array.from(locaisSet).sort();
    this.familias = Array.from(familiasSet).sort();
  }

  filtrarPlantas(): void {
    let filteredData = [...this.allPlantas];

    if (this.selectedLocal) {
      filteredData = filteredData.filter(planta => planta.nomeLocal === this.selectedLocal);
    }

    if (this.selectedFamilia) {
      filteredData = filteredData.filter(planta => planta.familia === this.selectedFamilia);
    }

    if (this.searchTerm) {
      const term = this.searchTerm.toLowerCase();
      filteredData = filteredData.filter(planta =>
        (planta.nomePopular && planta.nomePopular.toLowerCase().includes(term)) ||
        (planta.nomeCientifico && planta.nomeCientifico.toLowerCase().includes(term))
      );
    }

    this.data = filteredData;

    if (this.data.length === 0 && (this.selectedLocal || this.selectedFamilia || this.searchTerm)) {
      this.errorMessage = 'Nenhuma planta encontrada com os filtros selecionados.';
    } else {
      this.errorMessage = null;
    }
  }
}