// src/app/app.component.ts
import { Component } from '@angular/core';
import { RouterModule, Router, NavigationEnd } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { FiltroService } from './services/filtro.service';
import { filter } from 'rxjs';
import { HeaderComponent } from './shared/components/header/header.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatButtonModule,
    HeaderComponent
  ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent {
  title = 'Museu da Fauna e Flora';

  constructor(
    private filtroService: FiltroService,
    private router: Router
  ) {
    this.router.events.pipe(
      filter((event): event is NavigationEnd => event instanceof NavigationEnd)
    ).subscribe((event: NavigationEnd) => {
      if (typeof gtag === 'function') {
        gtag('event', 'page_view', {
          page_path: event.urlAfterRedirects,      // A rota para a qual o usuário navegou
          page_location: window.location.href, // A URL completa
          page_title: document.title           // O título da página
        });
      }
    });
  }
  
  onBusca(termo: string): void {
    this.filtroService.atualizarTermoBusca(termo);
  }
}
