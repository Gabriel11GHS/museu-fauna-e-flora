import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

// Módulos do Angular Material para ícones e divisórias
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';

@Component({
  selector: 'app-contato',
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule,
    MatDividerModule
  ],
  templateUrl: './contato.component.html',
  styleUrls: ['./contato.component.css']
})
export class ContatoComponent {
  // Nenhuma lógica complexa é necessária para esta página estática.
}
