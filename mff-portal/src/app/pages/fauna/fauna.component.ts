import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Animal } from '../../models/animal.model';
import { FaunaService } from '../../services/fauna.service';

// Angular Material
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

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
    MatProgressSpinnerModule
  ],
  templateUrl: './fauna.component.html',
  styleUrls: ['./fauna.component.css']
})
export class FaunaComponent implements OnInit {
  public isLoading: boolean = true;
  public searchTerm: string = '';
  public selectedGrupo: string = '';

  public allAnimais: Animal[] = [];
  public data: Animal[] = [];
  public errorMessage: string | null = null;

  public grupos: string[] = [];

  constructor(private faunaService: FaunaService) { }

  ngOnInit(): void {
    this.carregarAnimais();
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
}

