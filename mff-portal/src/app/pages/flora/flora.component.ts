// src/app/pages/flora/flora.component.ts
import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { of, forkJoin } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { ApiService } from '../../services/api.service';
import { Planta } from '../../models/planta.model';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSlideToggleChange, MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MapaFloraComponent } from '../../shared/components/mapa-flora/mapa-flora.component';

@Component({
  selector: 'app-flora',
  standalone: true,
  imports: [
    CommonModule, FormsModule, RouterLink, MatFormFieldModule, MatInputModule,
    MatIconModule, MatSelectModule, MatProgressSpinnerModule, MatCardModule,
    MatButtonModule, MatSlideToggleModule, MapaFloraComponent
  ],
  templateUrl: './flora.component.html',
  styleUrls: ['./flora.component.css']
})
export class FloraComponent implements OnInit {
  public isLoading = true;
  public isMapLoading = false;
  public showMap = false;
  public allPlantas: Planta[] = [];
  public data: Planta[] = [];
  public plantasParaMapa: Planta[] = [];
  public searchTerm = '';
  public selectedLocal = '';
  public selectedFamilia = '';
  public filtroAudio = false;
  public errorMessage: string | null = null;
  public locais: string[] = [];
  public familias: string[] = [];

  constructor(
    private apiService: ApiService,
    private route: ActivatedRoute,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    const localFromQuery = this.route.snapshot.queryParamMap.get('local');
    if (localFromQuery) {
      this.selectedLocal = localFromQuery;
    }
    this.carregarPlantas();
  }

  carregarPlantas(): void {
    this.isLoading = true;
    this.errorMessage = null;
    this.apiService.getPlantas().subscribe({
      next: (plantas) => {
        plantas.sort((a, b) => {
          const aHasPhoto = !!a.fotoIndividuo || !!a.fotoTaxonomia;
          const bHasPhoto = !!b.fotoIndividuo || !!b.fotoTaxonomia;
          return aHasPhoto === bHasPhoto ? 0 : aHasPhoto ? -1 : 1;
        });
        this.allPlantas = plantas;
        this.extractFilterOptions();
        this.filtrarPlantas();
        this.isLoading = false;
        this.cdr.markForCheck();
      },
      error: (error) => {
        console.error('Erro ao carregar dados:', error);
        this.errorMessage = 'Não foi possível carregar os dados. Tente mais tarde.';
        this.isLoading = false;
        this.cdr.markForCheck();
      }
    });
  }

  extractFilterOptions(): void {
    const locais = this.allPlantas.map(p => p.nomeLocal).filter((l): l is string => !!l);
    this.locais = [...new Set(locais)].sort();
    const familias = this.allPlantas.map(p => p.familia).filter((f): f is string => !!f && f !== 'Não identificada');
    this.familias = [...new Set(familias)].sort();
  }

  filtrarPlantas(): void {
    let filteredData = [...this.allPlantas];
    if (this.searchTerm) {
      const term = this.searchTerm.toLowerCase();
      filteredData = filteredData.filter(p =>
        p.nomePopular?.toLowerCase().includes(term) ||
        p.nomeCientifico?.toLowerCase().includes(term)
      );
    }
    if (this.selectedFamilia) {
      filteredData = filteredData.filter(p => p.familia === this.selectedFamilia);
    }
    if (this.selectedLocal) {
      filteredData = filteredData.filter(p => p.nomeLocal === this.selectedLocal);
    }
    if (this.filtroAudio) {
      filteredData = filteredData.filter(p => !!p.trilhaAudio);
    }
    this.data = filteredData;
    this.showMap = false; 
  }

  onMapToggleChange(event: MatSlideToggleChange): void {
    // PONTO DE VERIFICAÇÃO 1: O evento foi disparado?
    console.log('%c1. Toggle do mapa acionado. Novo estado:', 'color: blue; font-weight: bold;', event.checked);

    this.showMap = event.checked;
    
    // Se o toggle for desativado, não fazemos mais nada
    if (!event.checked) {
      return;
    }

    if (this.data.length > 0) {
      this.isMapLoading = true;
      
      // PONTO DE VERIFICAÇÃO 2: Estamos prestes a buscar os dados?
      console.log(`%c2. Buscando coordenadas para ${this.data.length} indivíduos.`, 'color: blue; font-weight: bold;');

      const requests = this.data.map(planta => 
        this.apiService.getIndividuo(planta.idIndividuo).pipe(
          catchError((err) => {
            // PONTO DE VERIFICAÇÃO 3 (Alerta): A busca para um indivíduo falhou?
            console.warn(`Falha ao buscar detalhes para o indivíduo ID: ${planta.idIndividuo}`, err);
            return of(planta); // Retorna a planta original sem coordenadas para não quebrar o forkJoin
          })
        )
      );

      forkJoin(requests).subscribe(plantasComCoordenadas => {
        // PONTO DE VERIFICAÇÃO 4: O que a API retornou?
        console.log('%c4. Resposta da API (forkJoin) recebida:', 'color: blue; font-weight: bold;', plantasComCoordenadas);

        this.plantasParaMapa = plantasComCoordenadas.filter(p => p.latitude && p.longitude);
        
        // PONTO DE VERIFICAÇÃO 5: Quantas plantas têm coordenadas válidas?
        console.log(`%c5. Plantas com coordenadas válidas encontradas: ${this.plantasParaMapa.length}`, 'color: blue; font-weight: bold;');

        this.isMapLoading = false;
        this.cdr.markForCheck();
      });
    }
  }

  trackByPlantId(index: number, planta: Planta): string {
    return planta.idIndividuo;
  }

  updateImageOnError(event: Event): void {
    (event.target as HTMLImageElement).src = 'assets/error/placeholder-image.png';
  }
}