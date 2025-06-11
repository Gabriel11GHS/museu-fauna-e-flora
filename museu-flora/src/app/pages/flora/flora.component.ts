import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { ApiService, Planta } from '../../services/api.service';
import { RouterLink } from '@angular/router'; // 1. Importar RouterLink

// Módulos do Angular Material
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-flora',
  standalone: true,
  imports: [
    CommonModule, 
    FormsModule, 
    RouterLink, // 2. Adicionar RouterLink aqui para que o template o reconheça
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatSelectModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './flora.component.html',
  styleUrls: ['./flora.component.css']
})
export class FloraComponent implements OnInit {
  public isLoading: boolean = true;
  public selectedLocal: string = '';
  public searchTerm: string = '';
  public selectedFamilia: string = '';

  public allPlantas: Planta[] = [];
  public data: Planta[] = [];
  public errorMessage: string | null = null;

  public locais: string[] = [];
  public familias: string[] = [];
  
  constructor(private apiService: ApiService) { }

  ngOnInit(): void {
    this.carregarPlantas();
  }
  
  carregarPlantas(): void {
    this.isLoading = true;
    this.errorMessage = null;

    this.apiService.getPlantas()
      .pipe(
        catchError(error => {
          console.error('Erro ao carregar dados das plantas:', error);
          this.errorMessage = 'Não foi possível carregar os dados. Verifique sua conexão ou tente mais tarde.';
          this.isLoading = false;
          return of([]);
        })
      )
      .subscribe(plantas => {
        this.allPlantas = plantas;
        this.data = plantas;
        this.extractFilterOptions();
        this.isLoading = false;
        this.filtrarPlantas();
      });
  }

  extractFilterOptions(): void {
    const locaisSet = new Set<string>();
    const familiasSet = new Set<string>();

    this.allPlantas.forEach(planta => {
      if (planta.nomeLocal) locaisSet.add(planta.nomeLocal);
      if (planta.familia && planta.familia !== 'Não identificada') familiasSet.add(planta.familia);
    });

    this.locais = Array.from(locaisSet).sort();
    this.familias = Array.from(familiasSet).sort();
  }

  public filtrarPlantas(): void {
    let filteredData = [...this.allPlantas];

    if (this.searchTerm) {
      const term = this.searchTerm.toLowerCase();
      filteredData = filteredData.filter(planta =>
        (planta.nomePopular && planta.nomePopular.toLowerCase().includes(term)) ||
        (planta.nomeCientifico && planta.nomeCientifico.toLowerCase().includes(term))
      );
    }

    if (this.selectedFamilia) {
      filteredData = filteredData.filter(planta => planta.familia === this.selectedFamilia);
    }

    if (this.selectedLocal) {
      filteredData = filteredData.filter(planta => planta.nomeLocal === this.selectedLocal);
    }

    this.data = filteredData;
  }

  trackByPlantId(index: number, planta: Planta): string {
    return planta.idIndividuo;
  }

  public updateImageOnError(event: Event): void {
    const imgElement = event.target as HTMLImageElement;
    imgElement.src = 'assets/placeholder-image.png';
  }
}
