import { Component, ChangeDetectorRef, ChangeDetectionStrategy, HostListener, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { NgClass } from '@angular/common';
import { Subscription } from 'rxjs';
import { HeaderStateService } from '../../../services/header-state.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    NgClass
  ],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HeaderComponent implements OnInit, OnDestroy {
  public isMobileMenuOpen = false;
  public isHomePage: boolean = false;
  public isScrolled: boolean = false;
  private stateSubscription: Subscription;

  constructor(
    private headerStateService: HeaderStateService,
    private cdr: ChangeDetectorRef
  ) {
    this.stateSubscription = new Subscription();
  }

  ngOnInit(): void {
    // Inscreve-se no estado da página inicial
    this.stateSubscription = this.headerStateService.isHomePage$.subscribe(isHome => {
      this.isHomePage = isHome;
      // Reavalia o estado de scroll imediatamente ao mudar de página
      this.onWindowScroll();
      this.cdr.detectChanges(); // Notifica o Angular para atualizar a view
    });
  }

  @HostListener('window:scroll', [])
  onWindowScroll(): void {
    const scrollOffset = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0;
    
    // A animação de scroll só é aplicável se estivermos na Home.
    // Nas outras páginas, o estado é sempre 'scrolled'.
    this.isScrolled = this.isHomePage ? scrollOffset > 50 : true;
    
    this.cdr.detectChanges(); // Notifica o Angular sobre a mudança
  }

  toggleMobileMenu(): void {
    this.isMobileMenuOpen = !this.isMobileMenuOpen;
  }

  ngOnDestroy(): void {
    // Evita memory leaks ao destruir o componente
    this.stateSubscription.unsubscribe();
  }
}