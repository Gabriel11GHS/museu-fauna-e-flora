import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Observable } from 'rxjs';
import { Animal } from '../../models/animal.model';
import { FaunaService } from '../../services/fauna.service';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-detalhe-animal',
  standalone: true,
  imports: [CommonModule, RouterLink, MatIconModule],
  templateUrl: './detalhe-animal.component.html',
  styleUrls: ['./detalhe-animal.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DetalheAnimalComponent implements OnInit {
  
  animal$!: Observable<Animal | undefined>;

  constructor(
    private route: ActivatedRoute,
    private faunaService: FaunaService
  ) {}

  ngOnInit(): void {
    // Pega o 'id' da URL como string
    const idParam = this.route.snapshot.paramMap.get('id');
    
    if (idParam) {
      // Converte o ID para número e busca o animal
      const id = +idParam;
      this.animal$ = this.faunaService.getAnimalById(id);
    }
  }

  // Fallback para imagem quebrada
  updateImageOnError(event: Event): void {
    const imgElement = event.target as HTMLImageElement;
    imgElement.src = 'assets/placeholder-image.png';
  }
}