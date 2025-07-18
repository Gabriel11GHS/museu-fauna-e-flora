import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DomSanitizer } from '@angular/platform-browser';
import { MatIconModule, MatIconRegistry } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-contato',
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule,
    MatDividerModule,
    MatButtonModule
  ],
  templateUrl: './contato.component.html',
  styleUrls: ['./contato.component.css']
})
export class ContatoComponent {
  
  constructor(
    private iconRegistry: MatIconRegistry,
    private sanitizer: DomSanitizer
  ) {
    // Ícones existentes
    this.iconRegistry.addSvgIcon('facebook', this.sanitizer.bypassSecurityTrustResourceUrl('assets/icons/facebook.svg'));
    this.iconRegistry.addSvgIcon('instagram', this.sanitizer.bypassSecurityTrustResourceUrl('assets/icons/instagram.svg'));
    this.iconRegistry.addSvgIcon('twitter', this.sanitizer.bypassSecurityTrustResourceUrl('assets/icons/twitter.svg'));
    
    // Novo ícone do Google
    this.iconRegistry.addSvgIcon('google', this.sanitizer.bypassSecurityTrustResourceUrl('assets/icons/google.svg'));
  }

  /**
   * Placeholder para a ação de agendar uma visita.
   * Futuramente, pode abrir um modal ou redirecionar para um formulário.
   */
  agendarVisita(): void {
    console.log('Botão "Agendar Visita" clicado. Implementar lógica de agendamento.');
    // Ex: this.router.navigate(['/agendamento']);
  }

  /**
   * Placeholder para a ação de conectar com a conta Google.
   * Futuramente, iniciará o fluxo de autenticação OAuth2.
   */
  conectarGoogle(): void {
    console.log('Botão "Conectar com Google" clicado. Implementar fluxo OAuth2.');
  }
}