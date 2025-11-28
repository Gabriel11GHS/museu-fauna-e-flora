import { Component, OnInit, ChangeDetectionStrategy, computed, signal, inject, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router'; // Corrigido para RouterModule que inclui RouterLink
import { ActivatedRoute } from '@angular/router';
import { toSignal, toObservable } from '@angular/core/rxjs-interop';
import { of, forkJoin, Observable, Subject } from 'rxjs';
import { catchError, debounceTime, distinctUntilChanged, map, switchMap, tap, startWith } from 'rxjs/operators';

import { ApiService } from '../../services/api.service';
import { Planta } from '../../models/planta.model';
import { MapaFloraComponent } from '../../shared/components/mapa-flora/mapa-flora.component';

// Módulos do Angular Material
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatCheckboxModule } from '@angular/material/checkbox';

@Component({
  selector: 'app-flora',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatSelectModule,
    MatProgressSpinnerModule,
    MatCardModule,
    MatButtonModule,
    MatSlideToggleModule,
    MatCheckboxModule,
    MapaFloraComponent
  ],
  templateUrl: './flora.component.html',
  styleUrls: ['./flora.component.css'],
  // MELHORIA 1: ChangeDetection OnPush para performance
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FloraComponent implements OnInit {
  // Injeção de dependência moderna (Angular 14+)
  private apiService = inject(ApiService);
  private route = inject(ActivatedRoute);

  // --- ESTADO REATIVO (Signals) ---

  // Filtros como Signals (Fonte da verdade)
  public searchTerm = signal<string>('');
  public selectedLocal = signal<string>('');
  public selectedFamilia = signal<string>('');
  public filtroAudio = signal<boolean>(false);
  public showMap = signal<boolean>(false);

  // Debounce para o termo de busca (melhoria de UX/Performance)
  private searchTermDebounced$ = toObservable(this.searchTerm).pipe(
    debounceTime(300),
    distinctUntilChanged()
  );
  // Signal derivado do Observable debounced
  public searchTermDebounced = toSignal(this.searchTermDebounced$, { initialValue: '' });

  // Loading States
  public isLoading = signal<boolean>(true);
  public isMapLoading = signal<boolean>(false);
  public errorMessage = signal<string | null>(null);

  // --- DADOS ---

  // Observable principal de carregamento de dados
  private plantasSource$ = this.apiService.getPlantasAtivas().pipe(
    tap(() => this.isLoading.set(false)),
    catchError(err => {
      console.error('Erro ao carregar flora:', err);
      this.errorMessage.set('Não foi possível carregar os dados. Tente mais tarde.');
      this.isLoading.set(false);
      return of([] as Planta[]);
    })
  );

  // Signal contendo todos os dados brutos (Read-only)
  public allPlantas = toSignal(this.plantasSource$, { initialValue: [] });

  // --- DADOS COMPUTADOS (Derivados) ---

  // Opções de filtro calculadas automaticamente quando allPlantas muda
  public locais = computed(() => {
    const list = this.allPlantas().map(p => p.nomeLocal).filter((l): l is string => !!l);
    return [...new Set(list)].sort();
  });

  public familias = computed(() => {
    const list = this.allPlantas().map(p => p.familia).filter((f): f is string => !!f && f !== 'Não identificada');
    return [...new Set(list)].sort();
  });

  // Lista Filtrada Principal (O coração da lógica)
  // Atualiza automaticamente se qualquer signal dependente mudar
  public filteredData = computed(() => {
    let data = this.allPlantas();
    const term = this.searchTermDebounced()?.toLowerCase() || '';
    const local = this.selectedLocal();
    const familia = this.selectedFamilia();
    const audioOnly = this.filtroAudio();

    if (term) {
      data = data.filter(p =>
        p.nomePopular?.toLowerCase().includes(term) ||
        p.nomeCientifico?.toLowerCase().includes(term)
      );
    }

    if (local) {
      data = data.filter(p => p.nomeLocal === local);
    }

    if (familia) {
      data = data.filter(p => p.familia === familia);
    }

    if (audioOnly) {
      data = data.filter(p => !!p.trilhaAudio);
    }

    // Ordenação padrão: Com foto primeiro
    return data.sort((a, b) => {
      const aHasPhoto = !!a.fotoIndividuo || !!a.fotoTaxonomia;
      const bHasPhoto = !!b.fotoIndividuo || !!b.fotoTaxonomia;
      return aHasPhoto === bHasPhoto ? 0 : aHasPhoto ? -1 : 1;
    });
  });

  // --- LÓGICA DO MAPA ---
  
  // Signal para armazenar dados do mapa
  public plantasParaMapa = signal<Planta[]>([]);

  constructor() {
    // Effect para reagir à ativação do mapa
    effect(() => {
      if (this.showMap()) {
        this.carregarDadosMapa(this.filteredData());
      }
    }, { allowSignalWrites: true });
  }

  ngOnInit(): void {
    // Leitura de Query Params inicial
    const params = this.route.snapshot.queryParams;
    if (params['local']) this.selectedLocal.set(params['local']);
    if (params['comAudio'] === 'true') this.filtroAudio.set(true);
  }

  // --- ACTIONS ---

  // Atualizadores de Signals (ligados ao template via event binding ou ngModel)
  updateSearchTerm(term: string) { this.searchTerm.set(term); }
  updateLocal(local: string) { this.selectedLocal.set(local); }
  updateFamilia(familia: string) { this.selectedFamilia.set(familia); }
  toggleAudio(checked: boolean) { this.filtroAudio.set(checked); }
  
  toggleMap(checked: boolean) {
    this.showMap.set(checked);
    // Se desligar o mapa, não precisamos fazer nada, o ngIf do template resolve
  }

  // Lógica refatorada de carregamento do mapa
  private carregarDadosMapa(plantasAtuais: Planta[]): void {
    if (plantasAtuais.length === 0) {
      this.plantasParaMapa.set([]);
      return;
    }

    this.isMapLoading.set(true);
    console.log(`Buscando coordenadas para ${plantasAtuais.length} indivíduos.`);

    // Otimização: Evitar requisições desnecessárias se já temos latitude/longitude
    // Assumindo que getIndividuo traz detalhes extras como lat/lng
    const requests = plantasAtuais.map(planta => {
      // Se o objeto planta já tivesse lat/lng, poderíamos pular a request aqui
      return this.apiService.getIndividuo(planta.idIndividuo).pipe(
        catchError(err => {
          console.warn(`Erro ao buscar indivíduo ${planta.idIndividuo}`, err);
          return of(planta); // Retorna a planta original em caso de erro
        })
      );
    });

    forkJoin(requests).subscribe({
      next: (detalhes) => {
        const validas = detalhes.filter((p): p is Planta => 
          !!p && p.latitude !== undefined && p.longitude !== undefined
        );
        this.plantasParaMapa.set(validas);
        this.isMapLoading.set(false);
      },
      error: () => this.isMapLoading.set(false)
    });
  }

  // Otimização para *ngFor
  trackByPlantId(index: number, planta: Planta): string | number {
    return planta.idIndividuo;
  }

  updateImageOnError(event: Event): void {
    const img = event.target as HTMLImageElement;
    // Previne loop infinito se a imagem de erro também falhar
    if (img.src.indexOf('assets/placeholder-image.png') === -1) {
      img.src = 'assets/placeholder-image.png';
    }
  }
}