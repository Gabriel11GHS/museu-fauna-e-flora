// src/app/pages/flora/flora.component.ts
import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { of, Subject } from 'rxjs';
import { catchError, takeUntil } from 'rxjs/operators';
import { ApiService, Planta } from '../../services/api.service';
import { RouterLink } from '@angular/router';
import { FiltroService } from '../../services/filtro.service';

// Módulos do Angular Material necessários para os filtros no template
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';


// O decorator @NgModule foi removido daqui, pois é incompatível com standalone: true

@Component({
  selector: 'app-flora',
  standalone: true,
  // As dependências (módulos e outros componentes) são declaradas aqui
  imports: [
    CommonModule, 
    FormsModule, 
    RouterLink,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatSelectModule
  ],
  templateUrl: './flora.component.html',
  styleUrls: ['./flora.component.css']
})
export class FloraComponent implements OnInit, OnDestroy {
  selectedLocal: string = '';
  searchTerm: string = '';
  selectedFamilia: string = '';

  allPlantas: Planta[] = [];
  data: Planta[] = [];
  errorMessage: string | null = null;

  locais: string[] = [];
  familias: string[] = [];

  // Subject para gerenciar o ciclo de vida do componente e evitar vazamentos de memória
  private destroy$ = new Subject<void>();
  
  
  constructor(
    private apiService: ApiService,
    private filtroService: FiltroService
  ) { }

  ngOnInit(): void {
    this.carregarPlantas();

    // Inscreve-se nas atualizações do termo de busca vindas do serviço
    this.filtroService.termoBusca$
      .pipe(takeUntil(this.destroy$)) // Cancela a inscrição quando o componente for destruído
      .subscribe(termo => {
        this.searchTerm = termo;
        this.filtrarPlantas();
      });
  }

  ngOnDestroy(): void {
    // Emite um valor para cancelar as inscrições e evitar memory leaks
    this.destroy$.next();
    this.destroy$.complete();
  }


  carregarPlantas(): void {
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

    if (this.data.length === 0 && (this.selectedLocal || this.selectedFamilia || this.searchTerm)) {
      this.errorMessage = null; 
    } else if (this.errorMessage && this.data.length > 0) {
      this.errorMessage = null; 
    }
  }

  trackByPlantId(index: number, planta: Planta): string {
    return planta.idIndividuo;
  }

  public updateImageOnError(event: Event): void {
    const imgElement = event.target as HTMLImageElement;
    imgElement.src = 'assets/placeholder-image.png';
  }

  onBusca(event: Event): void {
  const input = event.target as HTMLInputElement;
  this.searchTerm = input.value;
  // Optionally, trigger your search/filter logic here
  // Example: this.filterPlants();
''}
}