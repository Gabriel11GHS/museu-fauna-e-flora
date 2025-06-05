// src/app/services/api.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
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
  private apiUrl = 'https://mff.icmc.usp.br/Webservice/listarIndividuos';
  constructor(private http: HttpClient) {}

  getData(): Observable<any> {
       return this.http.get(this.apiUrl);
    }
  

  private construirUrl(path: string): string {
    // se já vier com http, retorna direto
    if (/^https?:\/\//.test(path)) return path;
    // senão, concatena com base sem o endpoint
  
    return `${this.apiUrl}/${path}`;
  }
}
