import { Component, OnInit, ChangeDetectionStrategy, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, ActivatedRoute } from '@angular/router'; // Adicionado ActivatedRoute
import { toSignal, toObservable } from '@angular/core/rxjs-interop';
import { of } from 'rxjs';
import { catchError, debounceTime, distinctUntilChanged, tap } from 'rxjs/operators';

import { Animal } from '../../models/animal.model';
import { FaunaService } from '../../services/fauna.service';

// Angular Material
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-fauna',
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
    MatButtonModule
  ],
  templateUrl: './fauna.component.html',
  styleUrls: ['./fauna.component.css'],
  // MELHORIA: Estratégia OnPush para alta performance
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FaunaComponent implements OnInit {
  // Injeção de dependências moderna
  private faunaService = inject(FaunaService);
  private route = inject(ActivatedRoute);

  // --- ESTADO REATIVO (Signals) ---
  
  // Filtros (Fonte da Verdade)
  public searchTerm = signal<string>('');
  public selectedGrupo = signal<string>('');
  
  // Estados de UI
  public isLoading = signal<boolean>(true);
  public errorMessage = signal<string | null>(null);

  // Debounce para busca textual (evita travamentos ao digitar)
  // Converte o signal para Observable, aplica o delay, e volta para Signal
  private searchTermDebounced$ = toObservable(this.searchTerm).pipe(
    debounceTime(300),
    distinctUntilChanged()
  );
  public searchTermDebounced = toSignal(this.searchTermDebounced$, { initialValue: '' });

  // --- DADOS ---
  
  // Observable fonte com tratamento de efeitos colaterais (loading/erro)
  private animaisSource$ = this.faunaService.getAnimais().pipe(
    tap(() => this.isLoading.set(false)),
    catchError(err => {
      console.error('Erro ao carregar fauna:', err);
      this.errorMessage.set('Não foi possível carregar os dados da fauna.');
      this.isLoading.set(false);
      return of([] as Animal[]);
    })
  );

  // Signal contendo todos os dados brutos (Read-only)
  // O subscribe é feito automaticamente pelo Angular
  public allAnimais = toSignal(this.animaisSource$, { initialValue: [] });

  // --- DADOS COMPUTADOS (Derivados) ---

  // Extrai a lista de grupos automaticamente sempre que 'allAnimais' mudar
  public grupos = computed(() => {
    const lista = this.allAnimais().map(a => a.grupo).filter(g => !!g);
    return [...new Set(lista)].sort();
  });

  // Lista filtrada principal
  // Recalcula automaticamente se qualquer dependência (termos, grupos, dados) mudar
  public filteredData = computed(() => {
    let data = this.allAnimais();
    const term = this.searchTermDebounced()?.toLowerCase() || '';
    const grupo = this.selectedGrupo();

    // Filtro de Texto
    if (term) {
      data = data.filter(animal =>
        animal.nomePopular?.toLowerCase().includes(term) ||
        animal.nomeCientifico?.toLowerCase().includes(term)
      );
    }

    // Filtro de Grupo
    if (grupo) {
      data = data.filter(animal => animal.grupo === grupo);
    }

    // Ordenação alfabética por nome popular
    return data.sort((a, b) => (a.nomePopular || '').localeCompare(b.nomePopular || ''));
  });

  ngOnInit(): void {
    // Recupera filtros da URL se existirem (ex: link compartilhado)
    const grupoParam = this.route.snapshot.queryParamMap.get('grupo');
    if (grupoParam) {
      this.selectedGrupo.set(grupoParam);
    }
  }

  // --- ACTIONS (Métodos chamados pelo Template) ---

  updateSearchTerm(term: string) {
    this.searchTerm.set(term);
  }

  updateGrupo(grupo: string) {
    this.selectedGrupo.set(grupo);
  }

  // Otimização para o track do @for (opcional com a nova sintaxe, mas boa prática)
  trackByAnimalId(index: number, animal: Animal): string | number {
    return animal.id; 
  }

  updateImageOnError(event: Event): void {
    const img = event.target as HTMLImageElement;
    // Previne loop infinito
    if (img.src.indexOf('assets/placeholder-image.png') === -1) {
      img.src = 'assets/placeholder-image.png';
    }
  }
}