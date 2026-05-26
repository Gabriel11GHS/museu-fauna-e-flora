import { Component, OnInit, ChangeDetectionStrategy, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { toSignal, toObservable } from '@angular/core/rxjs-interop';
import { of } from 'rxjs';
import { catchError, debounceTime, distinctUntilChanged, tap } from 'rxjs/operators';
import { Animal } from '../../models/animal.model';
import { FaunaService } from '../../services/fauna.service';
import { LiveAvailabilityService } from '../../services/live-availability.service';

// Angular Material Imports
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';

interface CameraProjetoClick {
  nome: string;
  id: string;
}

const PROJETO_CLICK_CAMERA_IDS = [
  '6738e98d'
];

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
    MatButtonModule
  ],
  templateUrl: './fauna.component.html',
  styleUrls: ['./fauna.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class FaunaComponent implements OnInit {
  // Injeção de dependências
  private faunaService = inject(FaunaService);
  private readonly streamBasePath = '/camera-feed';
  private readonly liveAvailabilityService = inject(LiveAvailabilityService);
  readonly liveStatus = this.liveAvailabilityService.status;

  // --- ESTADO REATIVO (Signals) ---

  // Filtros (Fonte da Verdade de Escrita)
  public searchTerm = signal<string>('');
  public selectedGrupo = signal<string>('');

  // Estados de UI
  public isLoading = signal<boolean>(true);
  public errorMessage = signal<string | null>(null);

  // Debounce para busca textual
  private searchTermDebounced$ = toObservable(this.searchTerm).pipe(
    debounceTime(300),
    distinctUntilChanged()
  );
  public searchTermDebounced = toSignal(this.searchTermDebounced$, { initialValue: '' });

  // --- DADOS ---

  // Observable fonte
  private animaisSource$ = this.faunaService.getAnimais().pipe(
    tap(() => this.isLoading.set(false)), // Atualiza o signal isLoading corretamente
    catchError((err: any) => {
      console.error('Erro ao carregar fauna:', err);
      this.errorMessage.set('Não foi possível carregar os dados da fauna.'); // Atualiza o signal de erro
      this.isLoading.set(false);
      return of([] as Animal[]);
    })
  );

  // Signal contendo todos os dados brutos (Leitura)
  public allAnimais = toSignal(this.animaisSource$, { initialValue: [] });

  // --- DADOS COMPUTADOS (Derivados) ---

  // Lista de grupos dinâmicos
  public grupos = computed(() => {
    const lista = this.allAnimais().map(a => a.grupo).filter(g => !!g);
    return Array.from(new Set(lista)).sort();
  });

  // Lista filtrada principal
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

    // Ordenação
    return data.sort((a, b) => (a.nomePopular || '').localeCompare(b.nomePopular || ''));
  });

  // --- CÂMERAS E STREAM ---
  public cameras: CameraProjetoClick[] = PROJETO_CLICK_CAMERA_IDS.map((id, index) => ({
    nome: `Câmera ${index + 1}`,
    id
  }));

  public selectedCameraId = '';
  public streamUrl: string | null = null;
  public isStreamOnline = true;

  constructor() {
    // O construtor fica vazio pois usamos inject() nas propriedades
  }

  ngOnInit(): void {
    this.configurarStream();
    // Não chamamos carregarAnimais() aqui, pois o toSignal(animaisSource$)
    // já inicia o carregamento automaticamente.
  }

  trocarCamera(novoId: string): void {
    if (!this.cameras.some(camera => camera.id === novoId)) {
      this.isStreamOnline = false;
      return;
    }

    this.selectedCameraId = novoId;
    this.configurarStream();
  }

  configurarStream(): void {
    if (!this.selectedCameraId) {
      this.streamUrl = null;
      this.isStreamOnline = false;
      return;
    }

    this.streamUrl = `${this.streamBasePath}/${this.selectedCameraId}`;
    this.isStreamOnline = true;
  }

  handleStreamError(): void {
    this.isStreamOnline = false;
  }

  updateGrupo(grupo: string) {
    this.selectedGrupo.set(grupo); // Forma correta de atualizar um signal
  }

  updateImageOnError(event: Event): void {
    const img = event.target as HTMLImageElement;
    if (img.src.indexOf('assets/placeholder-image.png') === -1) {
      img.src = 'assets/placeholder-image.png';
    }
  }
}