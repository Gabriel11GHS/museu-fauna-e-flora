// src/app/services/api.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable, find } from 'rxjs';

export interface Planta {
  idIndividuo: string;
  anoPlantio: string | null;
  trilhaAudio: string | null;
  fotoIndividuo: string | null;
  idTaxonomia: string;
  nomePopular: string | null;
  nomeCientifico: string | null;
  familia: string | null;
  fotoTaxonomia: string | null;
  idLocal: string;
  nomeLocal: string;
}

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  // URL da API que lista os indivíduos
  private apiUrl = '/api/Webservice/listarIndividuos'; 
  // URL base do servidor onde as imagens e áudios estão hospedados
  private baseUrl = 'https://mff.icmc.usp.br';

  constructor(private http: HttpClient) {}

  getPlantas(): Observable<Planta[]> {
    return this.http.get<Planta[]>(this.apiUrl).pipe(
      map(plantas => plantas.map(planta => this.processarPlanta(planta)))
    );
  };

  getPlantaById(id: string): Observable<Planta | undefined> {
    // Reutilizamos o método getPlantas() e usamos o operador 'find' do RxJS
    // para retornar apenas o item que corresponde ao ID.
    return this.getPlantas().pipe(
      map(plantas => plantas.find(planta => planta.idIndividuo === id))
    );
  }
  
  private processarPlanta(planta: Planta): Planta {
    // Função para limpar e construir a URL completa
    const construirUrl = (path: string | null): string | null => {
      if (!path) return null;
      // Remove o "./" do início, se existir
      const cleanPath = path.startsWith('./') ? path.substring(2) : path;
      return `${this.baseUrl}/${cleanPath}`;
    };

    return {
      ...planta,
      // Trata nomes nulos ou com '*'
      nomePopular: (planta.nomePopular === '*' || !planta.nomePopular) ? 'Não identificado' : planta.nomePopular,
      nomeCientifico: (planta.nomeCientifico === '*' || !planta.nomeCientifico) ? 'Não identificado' : planta.nomeCientifico,
      familia: (planta.familia === '*' || !planta.familia) ? 'Não identificada' : planta.familia.trim(),
      
      // Constrói as URLs completas para as mídias
      fotoIndividuo: construirUrl(planta.fotoIndividuo),
      fotoTaxonomia: construirUrl(planta.fotoTaxonomia),
      trilhaAudio: construirUrl(planta.trilhaAudio)
    };
  }
}