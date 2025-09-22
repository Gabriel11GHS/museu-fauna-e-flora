import { Component, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { MatTabsModule } from '@angular/material/tabs';

export interface EventoRealizado {
  data: string;
  titulo: string;
  descricao: string;
}

@Component({
  selector: 'app-eventos',
  standalone: true,
  imports: [
    CommonModule,
    MatTabsModule
  ],
  templateUrl: './eventos.component.html',
  styleUrls: ['./eventos.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EventosComponent {
  
  // URL de incorporação do Google Calendar
  private calendarUrl = 'https://calendar.google.com/calendar/embed?src=mff%40icmc.usp.br&ctz=America%2FSao_Paulo';
  public safeCalendarUrl: SafeResourceUrl;

  public eventosRealizados: EventoRealizado[] = [
    {
      data: '25/09/2025',
      titulo: 'Lançamento do Portal público',
      descricao: 'Evento de lançamento do novo portal do Museu da Fauna e Flora'
    }
  ];

  constructor(private sanitizer: DomSanitizer) {
    this.safeCalendarUrl = this.sanitizer.bypassSecurityTrustResourceUrl(this.calendarUrl);
  }

  trackByEvento(index: number, evento: EventoRealizado): string {
    return evento.titulo + evento.data;
  }
}