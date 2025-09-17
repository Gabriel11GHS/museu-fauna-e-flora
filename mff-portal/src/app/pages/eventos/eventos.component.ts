import { Component, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-eventos',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './eventos.component.html',
  styleUrls: ['./eventos.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EventosComponent {
  
  // URL de incorporação do Google Calendar
  private calendarUrl = 'https://calendar.google.com/calendar/embed?src=gabriel.dossantos%40usp.br&ctz=America%2FSao_Paulo';

  public safeCalendarUrl: SafeResourceUrl;

  constructor(private sanitizer: DomSanitizer) {
    // Marcamos a URL como segura para que o Angular permita sua renderização no iframe.
    this.safeCalendarUrl = this.sanitizer.bypassSecurityTrustResourceUrl(this.calendarUrl);
  }
}