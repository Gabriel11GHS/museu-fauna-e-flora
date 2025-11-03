// src/app/services/api.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable, catchError, of, shareReplay } from 'rxjs'; 
import { Planta } from '../models/planta.model';
import { Noticia } from '../models/noticia.model';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private apiUrl = '/api/Webservice'; 
  private baseUrl = 'https://mff.icmc.usp.br';
  private allPlantas$: Observable<Planta[]>;

  constructor(private http: HttpClient) {
    this.allPlantas$ = this.http.get<Planta[]>(this.apiUrl).pipe(
      // Processa *todas* as plantas primeiro
      map(plantas => plantas.map(planta => this.processarPlanta(planta))),
      // Cacheia o resultado (a lista processada) para todos os futuros inscritos
      shareReplay(1) 
    );
  }

  getPlantasAtivas(): Observable<Planta[]> {
    return this.allPlantas$.pipe(
      map(plantas => 
        plantas.filter(planta => 
          !planta.suprimido || 
          planta.suprimido === "0"
        )
      )
    );
  }

  getPlantasSuprimidas(): Observable<Planta[]> {
    return this.allPlantas$.pipe(
      map(plantas => 
        plantas.filter(planta => planta.suprimido === "1") // Filtra apenas as suprimidas
      )
    );
  }

  getIndividuo(id: string): Observable<Planta | undefined> {
    return this.allPlantas$.pipe(
      map(plantas => plantas.find(planta => planta.idIndividuo === id))
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

  getNoticias(): Observable<Noticia[]> {
    return this.http.get<Noticia[]>('assets/data/noticias.json')
      .pipe(
        catchError(error => {
          console.error('Erro ao carregar notícias:', error);
          // Retorna um array vazio em caso de erro para não quebrar a aplicação.
          return of([]);
        })
      );
  }

}