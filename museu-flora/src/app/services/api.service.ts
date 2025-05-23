// src/app/services/api.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { API_URL } from '../app.config';
import { Planta } from '../models/planta.model';

interface ApiPlanta {
  idIndividuo: string;
  nomePopular: string | null;
  nomeCientifico: string | null;
  familia: string | null;
  nomeLocal: string;
  fotoTaxonomia: string | null;
  fotoIndividuo: string | null;
  trilhaAudio: string | null;
}

@Injectable({ providedIn: 'root' })
export class ApiService {
  constructor(private http: HttpClient) {}

  getPlantas(): Observable<Planta[]> {
    return this.http.get<ApiPlanta[]>(API_URL).pipe(
      map(list =>
        list.map(p => ({
          id: +p.idIndividuo,
          nome: p.nomePopular ?? '—',
          nomeCientifico: p.nomeCientifico ?? '—',
          classeCientifica: p.familia ?? '—',
          local: p.nomeLocal,
          imagem: p.fotoIndividuo
            ? this.construirUrl(p.fotoIndividuo)
            : p.fotoTaxonomia
            ? this.construirUrl(p.fotoTaxonomia)
            : undefined,
          audio: p.trilhaAudio
            ? this.construirUrl(p.trilhaAudio)
            : undefined
        }))
      )
    );
  }

  private construirUrl(path: string): string {
    // se já vier com http, retorna direto
    if (/^https?:\/\//.test(path)) return path;
    // senão, concatena com base sem o endpoint
    return API_URL.replace(/listarIndividuos\?$/, '') + path;
  }
}

