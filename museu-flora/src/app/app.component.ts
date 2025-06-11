// src/app/app.component.ts
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { FiltroService } from './services/filtro.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatButtonModule
  ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent {
  title = 'Museu da Fauna e Flora';

  // Injeta o FiltroService
  constructor(private filtroService: FiltroService) {}

  /**
   * Chamado sempre que o usuário digita no campo de busca.
   * @param termo O valor atual do campo.
   */
  onBusca(termo: string): void {
    this.filtroService.atualizarTermoBusca(termo);
  }
}
