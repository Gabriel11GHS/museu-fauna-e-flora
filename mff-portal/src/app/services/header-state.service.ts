import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

/**
 * Serviço para gerenciar o estado de exibição do HeaderComponent.
 * Controla se a animação especial da página inicial deve estar ativa.
 */
@Injectable({
  providedIn: 'root'
})
export class HeaderStateService {

  // BehaviorSubject mantém o último valor emitido e o fornece a novos inscritos.
  // Inicia como `false`, pois a página inicial não é a primeira a ser carregada por padrão.
  private isHomePageSubject = new BehaviorSubject<boolean>(false);

  /**
   * Observable público que os componentes podem assinar para reagir às mudanças
   * de estado da página inicial.
   */
  public isHomePage$: Observable<boolean> = this.isHomePageSubject.asObservable();

  constructor() { }

  /**
   * Método público para permitir que os componentes (como a HomeComponent)
   * atualizem o estado de visibilidade da página inicial.
   * @param isActive - `true` se a HomeComponent está ativa, `false` caso contrário.
   */
  public setIsHomePage(isActive: boolean): void {
    this.isHomePageSubject.next(isActive);
  }
}