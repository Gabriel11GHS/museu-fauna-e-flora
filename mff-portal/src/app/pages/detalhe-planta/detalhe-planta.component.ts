// src/app/pages/detalhe-planta/detalhe-planta.component.ts
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router'; // Importe ActivatedRoute e RouterLink
import { CommonModule } from '@angular/common';
import { ApiService} from '../../services/api.service';
import { Planta } from '../../models/planta.model';
import { Observable } from 'rxjs';
import { MatIcon } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { trigger, transition, style, animate } from '@angular/animations';
import { MapaFloraComponent } from '../../shared/components/mapa-flora/mapa-flora.component';

@Component({
  selector: 'app-detalhe-planta',
  standalone: true,
  imports: [CommonModule,
            MatIcon,
            MatProgressSpinnerModule,
            RouterLink,
            MapaFloraComponent],
  templateUrl: './detalhe-planta.component.html',
  styleUrls: ['./detalhe-planta.component.css'],
  animations: [
    trigger('fadeIn', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(20px)' }),
        animate('500ms ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
      ])
    ])
  ]
})
export class DetalhePlantaComponent implements OnInit {
  
  planta$!: Observable<Planta | undefined>; 

  constructor(
    private route: ActivatedRoute,
    private apiService: ApiService
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    
    if (id) {
      // Agora chamamos o novo método do serviço
      this.planta$ = this.apiService.getIndividuo(id);
    }
  }

  public updateImageOnError(event: Event): void {
    const imgElement = event.target as HTMLImageElement;
    imgElement.src = 'assets/placeholder-image.png';
  }
}
