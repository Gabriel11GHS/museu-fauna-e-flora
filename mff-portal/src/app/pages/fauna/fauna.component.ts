import { Component, OnInit, ChangeDetectionStrategy, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule, ActivatedRoute } from '@angular/router'; // Adicionado ActivatedRoute
import { toSignal, toObservable } from '@angular/core/rxjs-interop';
import { of } from 'rxjs';
import { catchError, debounceTime, distinctUntilChanged, tap } from 'rxjs/operators';

import { Animal } from '../../models/animal.model';
import { FaunaService } from '../../services/fauna.service';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

// Angular Material
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider'; 

@Component({
  selector: 'app-fauna',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatSelectModule,
    MatProgressSpinnerModule,
    MatCardModule,
    MatDividerModule,
    MatProgressSpinnerModule,
    MatCardModule,
    MatButtonModule
  ],
  templateUrl: './fauna.component.html',
  styleUrls: ['./fauna.component.css'],
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

  // Lista das 3 câmeras disponíveis
  public cameras = [
    { nome: 'Câmera 1', id: 'ddef5e10' },
    { nome: 'Câmera 2', id: 'f9f24118' },
    { nome: 'Câmera 3', id: 'a118e87a' },
    { nome: 'Câmera 4', id: '6738e98d' },
    { nome: 'Câmera 5', id: 'cf585b1c' },
    { nome: 'Câmera 6', id: '2b5e6023' }
  ];

  public selectedCameraId = '61847ce2';

  //Variável para controle do Projeto Click
  public streamUrl: SafeResourceUrl | null = null;

  // Flag para simular se o stream está ativo
  public isStreamOnline = true; 

  private sanitizer = inject(DomSanitizer);

  
  constructor(private faunaService: FaunaService) { }

  // Carregar dados da fauna ao iniciar o componente
  ngOnInit(): void {
    this.configurarStream();
    this.carregarAnimais();
  }

  // Função chamada no HTML para trocar a câmera
  trocarCamera(novoId: string): void {
    this.selectedCameraId = novoId;
    this.configurarStream();
  }

  configurarStream(): void {
    // Aponta para a rota relativa /camera-feed/
    // O nosso servidor Node.js vai interceptar isso
    const urlRelativa = `/camera-feed/${this.selectedCameraId}`;
    this.streamUrl = this.sanitizer.bypassSecurityTrustResourceUrl(urlRelativa);
    this.isStreamOnline = true;
  }

  // Método para lidar com erro de carregamento da imagem
  handleStreamError(): void {
    this.isStreamOnline = false;
  }

  carregarAnimais(): void {
    this.isLoading = true;
    this.faunaService.getAnimais().pipe(
      catchError(err => {
        this.errorMessage = 'Não foi possível carregar os dados da fauna.';
        console.error(err);
        this.isLoading = false;
        return of([]);
      })
    ).subscribe(animais => {
      this.allAnimais = animais;
      this.data = animais;
      this.extractFilterOptions();
      this.isLoading = false;
    });
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
  
  trackByAnimalId(index: number, animal: Animal): string | number {
    return animal.id; // Assume que 'id' existe, como visto no [routerLink]
  }

}
