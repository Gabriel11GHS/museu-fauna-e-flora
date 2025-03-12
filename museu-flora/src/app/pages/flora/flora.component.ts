// src/app/pages/flora/flora.component.ts
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { FloraService, Planta } from '../../services/flora.service';

@Component({
  selector: 'app-flora',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './flora.component.html',
  styleUrls: ['./flora.component.css']
})
export class FloraComponent implements OnInit {
  plantas: Planta[] = [];
  locais: string[] = [];
  selectedLocal: string = 'Todos';

  constructor(private floraService: FloraService) {}

  ngOnInit(): void {
    // Carrega todas as plantas do serviço
    this.plantas = this.floraService.getPlantas();

    // Monta a lista de locais com tipagem explícita para p
    this.locais = ['Todos', ...new Set(this.plantas.map((p: Planta) => p.local))];
  }

  filtrarPorLocal(): void {
    const todas = this.floraService.getPlantas();
    if (this.selectedLocal === 'Todos') {
      this.plantas = todas;
    } else {
      this.plantas = todas.filter((p: Planta) => p.local === this.selectedLocal);
    }
  }
}
