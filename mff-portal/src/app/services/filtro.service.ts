// src/app/services/filtro.service.ts
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FiltroService {
  // BehaviorSubject armazena o valor atual e o emite para novos inscritos.
  // Começa com uma string vazia.
  private termoBuscaSubject = new BehaviorSubject<string>('');

  // Expomos o BehaviorSubject como um Observable para que os componentes possam se inscrever.
  public termoBusca$ = this.termoBuscaSubject.asObservable();

  constructor() { }

  /**
   * Atualiza o termo de busca para todos os componentes inscritos.
   * @param termo O novo termo digitado pelo usuário.
   */
  public atualizarTermoBusca(termo: string): void {
    this.termoBuscaSubject.next(termo);
  }
}