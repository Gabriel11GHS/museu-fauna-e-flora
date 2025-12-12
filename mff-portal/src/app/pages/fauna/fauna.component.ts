import { Component, OnInit, ChangeDetectionStrategy, inject} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { of } from 'rxjs';
import { catchError } from 'rxjs/operators';
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
import { MatDividerModule } from '@angular/material/divider'; 

@Component({
  selector: 'app-fauna',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterLink,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatSelectModule,
    MatProgressSpinnerModule,
    MatCardModule,
    MatDividerModule
  ],
  templateUrl: './fauna.component.html',
  styleUrls: ['./fauna.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush 
})
export class FaunaComponent implements OnInit {
  
  // Variáveis para controle de estado e dados do catálogo
  public isLoading: boolean = true;
  public searchTerm: string = '';
  public selectedGrupo: string = '';

  public allAnimais: Animal[] = [];
  public data: Animal[] = [];
  public errorMessage: string | null = null;

  public grupos: string[] = [];

  // Lista das 3 câmeras disponíveis
  public cameras = [
    { nome: 'Câmera 1', id: 'ddef5e10' },
    { nome: 'Câmera 2', id: 'f9f24118' },
    { nome: 'Câmera 3', id: 'a118e87a' },
    { nome: 'Câmera 4', id: '6738e98d' },
    { nome: 'Câmera 5', id: 'cf585b1c' }
    { nome: 'Câmera 6', id: 'f9f24118' }
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

  extractFilterOptions(): void {
    const gruposSet = new Set(this.allAnimais.map(animal => animal.grupo));
    this.grupos = Array.from(gruposSet).sort();
  }

  filtrarAnimais(): void {
    let filteredData = [...this.allAnimais];

    if (this.searchTerm) {
      const term = this.searchTerm.toLowerCase();
      filteredData = filteredData.filter(animal =>
        animal.nomePopular.toLowerCase().includes(term) ||
        animal.nomeCientifico.toLowerCase().includes(term)
      );
    }

    if (this.selectedGrupo) {
      filteredData = filteredData.filter(animal => animal.grupo === this.selectedGrupo);
    }

    this.data = filteredData;
  }
  
  trackByAnimalId(index: number, animal: Animal): string | number {
    return animal.id; // Assume que 'id' existe, como visto no [routerLink]
  }

}

