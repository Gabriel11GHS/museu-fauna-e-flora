// src/app/pages/flora/flora.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { ApiService, Planta } from '../../services/api.service';

@Component({
  selector: 'app-flora',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './flora.component.html',
  styleUrls: ['./flora.component.css']
})
export class FloraComponent implements OnInit {
  selectedLocal: string = '';
  searchTerm: string = '';
  selectedFamilia: string = '';

  allPlantas: Planta[] = [];
  data: Planta[] = [];
  errorMessage: string | null = null;

  locais: string[] = [];
  familias: string[] = [];
  
  // Injetamos o ApiService no construtor
  constructor(private apiService: ApiService) { }

  ngOnInit(): void {
    this.carregarPlantas();
  }

  carregarPlantas(): void {
    // Chama o serviço para obter os dados das plantas
    this.apiService.getPlantas()
      .pipe(
        catchError(error => {
          console.error('Erro ao carregar dados das plantas:', error);
          this.errorMessage = 'Não foi possível carregar os dados das plantas. Tente novamente mais tarde.';
          return of([]);
        })
      )
      .subscribe(plantas => {
        this.allPlantas = plantas;
        this.extractFilterOptions();
        this.filtrarPlantas(); 
      });
  }

  extractFilterOptions(): void {
    const locaisSet = new Set<string>();
    const familiasSet = new Set<string>();

    this.allPlantas.forEach(planta => {
      if (planta.nomeLocal) {
        locaisSet.add(planta.nomeLocal);
      }
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

    // Lógica para mensagem de "nenhum resultado"
    if (this.data.length === 0 && (this.selectedLocal || this.selectedFamilia || this.searchTerm)) {
      this.errorMessage = null; // Limpa erro de carregamento para não confundir
    } else if (this.errorMessage && this.data.length > 0) {
      this.errorMessage = null; // Limpa erro de carregamento se os dados chegarem
    }
  }

  // Função para otimizar o *ngFor
  trackByPlantId(index: number, planta: Planta): string {
    return planta.idIndividuo;
  }

  // Método para atualizar a imagem quando ocorrer um erro de carregamento
  public updateImageOnError(event: Event): void {
    const imgElement = event.target as HTMLImageElement;
    imgElement.src = 'assets/placeholder-image.png';
  }
}
