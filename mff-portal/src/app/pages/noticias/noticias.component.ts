import { Component, ChangeDetectionStrategy, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { toSignal } from '@angular/core/rxjs-interop';
import { catchError, tap } from 'rxjs/operators';
import { of } from 'rxjs';
import { ApiService } from '../../services/api.service';
import { Noticia } from '../../models/noticia.model';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-noticias',
  standalone: true,
  imports: [
    CommonModule,
    MatProgressSpinnerModule,
    MatIconModule
  ],
  templateUrl: './noticias.component.html',
  styleUrls: ['./noticias.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NoticiasComponent {

  // Injeção de dependência moderna
  private apiService = inject(ApiService);

  // --- ESTADO REATIVO (Signals) ---

  // Controla o spinner de carregamento
  public isLoading = signal<boolean>(true);

  // Armazena mensagens de erro para exibir ao usuário
  public errorMessage = signal<string | null>(null);

  // --- DADOS ---

  // Observable fonte que gerencia o fluxo da API e efeitos colaterais (loading/erro)
  private noticiasSource$ = this.apiService.getNoticias().pipe(
    tap(() => this.isLoading.set(false)),
    catchError(err => {
      console.error('Erro ao carregar notícias:', err);
      this.errorMessage.set('Não foi possível carregar as notícias. Tente mais tarde.');
      this.isLoading.set(false);
      return of([] as Noticia[]);
    })
  );
  // Converte o Observable em Signal para uso na template
  public noticias = toSignal(this.noticiasSource$, { initialValue: [] });

}
