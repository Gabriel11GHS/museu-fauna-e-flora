// src/app/pages/flora/flora.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../services/api.service';
import { Planta } from '../../models/planta.model';

@Component({
  selector: 'app-flora',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './flora.component.html',
  styleUrls: ['./flora.component.css']
})
export class FloraComponent implements OnInit {
  todasPlantas: Planta[] = [];
  plantas: Planta[] = [];
  locais: string[] = [];
  classes: string[] = [];
  selectedLocal = 'Todos';
  selectedClasse = 'Todos';
  searchTerm = '';

  constructor(private api: ApiService) {}

  ngOnInit(): void {
    this.api.getPlantas().subscribe(pls => {
      this.todasPlantas = pls;
      this.plantas = [...pls];
      this.locais = ['Todos', ...new Set(pls.map(p => p.local))];
      this.classes = ['Todos', ...new Set(pls.map(p => p.classeCientifica))];
    });
  }

  filtrarPlantas(): void {
    this.plantas = this.todasPlantas.filter(p => {
      const okLocal = this.selectedLocal === 'Todos' || p.local === this.selectedLocal;
      const okClasse =
        this.selectedClasse === 'Todos' || p.classeCientifica === this.selectedClasse;
      const okBusca =
        !this.searchTerm ||
        p.nome.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        p.nomeCientifico.toLowerCase().includes(this.searchTerm.toLowerCase());
      return okLocal && okClasse && okBusca;
    });
  }
}