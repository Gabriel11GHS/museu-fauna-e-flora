// src/app/services/flora.service.ts
import { Injectable } from '@angular/core';

export interface Planta {
  id: number;
  nome: string;
  local: string;
  imagem?: string;
}

@Injectable({
  providedIn: 'root'
})
export class FloraService {
  private plantas: Planta[] = [
    { id: 1, nome: 'Ipê Amarelo', local: 'Área 1', imagem: 'assets/ipe.jpg' },
    { id: 2, nome: 'Pau-Brasil', local: 'Área 1', imagem: 'assets/pau-brasil.jpg' },
    { id: 3, nome: 'Jabuticabeira', local: 'Área 2', imagem: 'assets/jabuticaba.jpg' },
    { id: 4, nome: 'Samambaia', local: 'Área 3', imagem: 'assets/samambaia.jpg' }
  ];

  getPlantas(): Planta[] {
    return this.plantas;
  }
}
