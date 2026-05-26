import { computed, Injectable } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { map, timer } from 'rxjs';

export interface LiveAvailabilityStatus {
  available: boolean;
  badge: string;
  title: string;
  message: string;
  helper: string;
}

@Injectable({
  providedIn: 'root',
})
export class LiveAvailabilityService {
  /**
   * Horário aproximado em que a câmera costuma ter luminosidade suficiente.
   * Ajuste aqui se quiser mudar a regra.
   */
  private readonly liveStartHour = 5;
  private readonly liveEndHour = 18;

  /**
   * Atualiza o status a cada minuto.
   */
  private readonly now = toSignal(
    timer(0, 60_000).pipe(map(() => new Date())),
    { initialValue: new Date() }
  );

  readonly status = computed<LiveAvailabilityStatus>(() => {
    const currentDate = this.now();
    const saoPauloHour = this.getSaoPauloHour(currentDate);

    const available =
      saoPauloHour >= this.liveStartHour &&
      saoPauloHour < this.liveEndHour;

    if (available) {
      return {
        available: true,
        badge: 'Ao vivo',
        title: 'Transmissão disponível',
        message:
          'A câmera está em período favorável de luminosidade para observação da fauna.',
        helper: 'Disponível aproximadamente até 18h.',
      };
    }

    return {
      available: false,
      badge: 'Indisponível no momento',
      title: 'Observação limitada pela luminosidade',
      message:
        'Por conta do horário e da baixa luminosidade, não é possível assistir à live agora.',
      helper: 'A visualização costuma ser melhor entre 06h e 18h.',
    };
  });

  private getSaoPauloHour(date: Date): number {
    const formatter = new Intl.DateTimeFormat('pt-BR', {
      timeZone: 'America/Sao_Paulo',
      hour: '2-digit',
      hour12: false,
    });

    return Number(formatter.format(date));
  }
}