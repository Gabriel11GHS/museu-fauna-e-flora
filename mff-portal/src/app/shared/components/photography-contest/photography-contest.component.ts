import { DOCUMENT } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  HostListener,
  OnDestroy,
  OnInit,
  ViewChild,
  inject,
  signal
} from '@angular/core';
import { MatIconModule } from '@angular/material/icon';

const INTRO_STORAGE_KEY = 'mff-photography-contest-intro-seen';

@Component({
  selector: 'app-photography-contest',
  standalone: true,
  imports: [MatIconModule],
  templateUrl: './photography-contest.component.html',
  styleUrls: ['./photography-contest.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PhotographyContestComponent implements OnInit, OnDestroy {
  private readonly document = inject(DOCUMENT);
  private readonly host = inject(ElementRef<HTMLElement>);

  @ViewChild('trigger') private trigger?: ElementRef<HTMLButtonElement>;
  @ViewChild('panelTitle') private panelTitle?: ElementRef<HTMLHeadingElement>;

  // Preencha estes campos quando os endereços e o período forem definidos.
  protected readonly editalUrl = 'https://drive.google.com/file/d/1NkI1S6Xxi2pT4nPlwjXR-bl8YWNO4VtW/view?pli=1';
  protected readonly formularioUrl = 'https://forms.gle/ZYxgvgKLJ4fzVrLTA';
  protected readonly periodoInscricoes = 'Até 5 de dezembro';

  protected readonly isOpen = signal(false);
  protected readonly isExpanded = signal(true);

  private collapseTimer: ReturnType<typeof setTimeout> | null = null;
  private pointerInside = false;
  private focusInside = false;

  ngOnInit(): void {
    try {
      const storage = this.document.defaultView?.sessionStorage;
      if (storage?.getItem(INTRO_STORAGE_KEY) === 'seen') {
        this.isExpanded.set(false);
        return;
      }
      storage?.setItem(INTRO_STORAGE_KEY, 'seen');
    } catch {
      // O botão continua funcionando quando o armazenamento está indisponível.
    }
    this.scheduleCollapse(6000);
  }

  ngOnDestroy(): void {
    this.clearCollapseTimer();
  }

  @HostListener('mouseenter')
  onMouseEnter(): void {
    this.pointerInside = true;
    this.clearCollapseTimer();
  }

  @HostListener('mouseleave')
  onMouseLeave(): void {
    this.pointerInside = false;
    this.scheduleCollapse(1200);
  }

  @HostListener('focusin')
  onFocusIn(): void {
    this.focusInside = true;
    this.clearCollapseTimer();
  }

  @HostListener('focusout', ['$event'])
  onFocusOut(event: FocusEvent): void {
    if (!this.host.nativeElement.contains(event.relatedTarget as Node | null)) {
      this.focusInside = false;
      this.scheduleCollapse(1200);
    }
  }

  @HostListener('document:keydown.escape', ['$event'])
  onEscape(event: KeyboardEvent): void {
    if (this.isOpen()) {
      event.stopPropagation();
      this.closePanel();
    }
  }

  @HostListener('document:pointerdown', ['$event'])
  onOutsidePointerDown(event: PointerEvent): void {
    if (this.isOpen() && !this.host.nativeElement.contains(event.target as Node | null)) {
      this.closePanel(false);
    }
  }

  protected togglePanel(): void {
    if (this.isOpen()) {
      this.closePanel();
      return;
    }

    this.clearCollapseTimer();
    this.isExpanded.set(false);
    this.isOpen.set(true);
    setTimeout(() => this.panelTitle?.nativeElement.focus());
  }

  protected closePanel(restoreFocus = true): void {
    this.isOpen.set(false);
    if (restoreFocus) {
      this.trigger?.nativeElement.focus();
    }
  }

  private scheduleCollapse(delay: number): void {
    this.clearCollapseTimer();
    if (!this.isExpanded() || this.isOpen() || this.pointerInside || this.focusInside) {
      return;
    }
    this.collapseTimer = setTimeout(() => this.isExpanded.set(false), delay);
  }

  private clearCollapseTimer(): void {
    if (this.collapseTimer !== null) {
      clearTimeout(this.collapseTimer);
      this.collapseTimer = null;
    }
  }
}
