// src/app/pages/detalhe-planta/detalhe-planta.component.ts
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router'; // Importe ActivatedRoute e RouterLink
import { CommonModule } from '@angular/common';
import { ApiService, Planta } from '../../services/api.service';
import { Observable } from 'rxjs';
import { MatIcon } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-detalhe-planta',
  standalone: true,
  imports: [CommonModule,
            MatIcon,
            MatProgressSpinnerModule,
            RouterLink], // Adicione RouterLink para o botão de voltar
  templateUrl: './detalhe-planta.component.html',
  styleUrls: ['./detalhe-planta.component.css']
})
export class DetalhePlantaComponent implements OnInit {
  
  planta$: Observable<Planta | undefined> | undefined;

  constructor(
    private route: ActivatedRoute,
    private apiService: ApiService
  ) {}

  ngOnInit(): void {
    // Pegamos o 'id' da URL
    const id = this.route.snapshot.paramMap.get('id');
    
    if (id) {
      // Usamos o novo método do serviço para buscar a planta
      this.planta$ = this.apiService.getPlantaById(id);
    }
  }

  // Método para atualizar a imagem quando ocorrer um erro de carregamento
  public updateImageOnError(event: Event): void {
    const imgElement = event.target as HTMLImageElement;
    imgElement.src = 'assets/placeholder-image.png';
  }
}
