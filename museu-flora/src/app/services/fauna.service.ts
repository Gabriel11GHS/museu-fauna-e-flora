import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { Animal } from '../models/animal.model';

@Injectable({
  providedIn: 'root'
})
export class FaunaService {
  private localApiUrl = 'assets/data/fauna.json';

  constructor(private http: HttpClient) { }

  /**
   * Retorna um Observable com a lista de todos os animais do arquivo JSON.
   */
  getAnimais(): Observable<Animal[]> {
    return this.http.get<Animal[]>(this.localApiUrl);
  }

  getAnimalById(id: number): Observable<Animal | undefined> {
    return this.getAnimais().pipe(
      map(animais => animais.find(animal => animal.id === id))
    );
  }
}

