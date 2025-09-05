// src/app/services/api.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs'; 
import { Planta } from '../models/planta.model';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private apiUrl = '/api/Webservice'; 
  private baseUrl = 'https://mff.icmc.usp.br';

  constructor(private http: HttpClient) {}

  // Este método continua como está, para a listagem
  getPlantas(): Observable<Planta[]> {
    return this.http.get<Planta[]>(`${this.apiUrl}/listarIndividuos`).pipe(
      map(plantas => plantas.map(planta => this.processarPlanta(planta)))
    );
  }

  // Busca um indivíduo específico pelo ID
  getIndividuo(id: string): Observable<Planta> {
    return this.http.get<Planta>(`${this.apiUrl}/obterIndividuo/${id}`).pipe(
      map(planta => this.processarPlanta(planta))
    );
  }
  
  private processarPlanta(planta: any): Planta { // Recebe 'any' para flexibilidade
    const construirUrl = (path: string | null): string | null => {
      if (!path) return null;
      const cleanPath = path.startsWith('./') ? path.substring(2) : path;
      return `${this.baseUrl}/${cleanPath}`;
    };

    return {
      ...planta,
      nomePopular: (planta.nomePopular === '*' || !planta.nomePopular) ? 'Não identificado' : planta.nomePopular,
      nomeCientifico: (planta.nomeCientifico === '*' || !planta.nomeCientifico) ? 'Não identificado' : planta.nomeCientifico,
      familia: (planta.familia === '*' || !planta.familia) ? 'Não identificada' : planta.familia?.trim(),
      
      fotoIndividuo: construirUrl(planta.fotoIndividuo),
      fotoTaxonomia: construirUrl(planta.fotoTaxonomia),
      trilhaAudio: construirUrl(planta.trilhaAudio)
    };
  }
}