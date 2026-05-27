import { DOCUMENT } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  HostListener,
  OnInit,
  computed,
  inject,
  signal
} from '@angular/core';
import { MatIconModule } from '@angular/material/icon';

interface AccessibilityState {
  highContrast: boolean;
  darkMode: boolean;
  fontScale: number;
  marker: boolean;
  guide: boolean;
}

const STORAGE_KEY = 'mff-accessibility-state';
const DEFAULT_STATE: AccessibilityState = {
  highContrast: false,
  darkMode: false,
  fontScale: 1,
  marker: false,
  guide: false
};
const FONT_STEP = 0.1;
const MIN_FONT_SCALE = 0.85;
const MAX_FONT_SCALE = 1.3;

@Component({
  selector: 'app-accessibility-menu',
  standalone: true,
  imports: [MatIconModule],
  templateUrl: './accessibility-menu.component.html',
  styleUrls: ['./accessibility-menu.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AccessibilityMenuComponent implements OnInit {
  private readonly document = inject(DOCUMENT);

  protected readonly isOpen = signal(false);
  protected readonly state = signal<AccessibilityState>({ ...DEFAULT_STATE });
  protected readonly guideY = signal(0);
  protected readonly triggerLabel = computed(() =>
    this.isOpen() ? 'Fechar menu de acessibilidade' : 'Abrir menu de acessibilidade'
  );
  protected readonly fontScaleLabel = computed(() =>
    `${Math.round(this.state().fontScale * 100)}%`
  );

  ngOnInit(): void {
    const savedState = this.loadState();

    this.state.set(savedState);
    this.applyState(savedState);

    if (savedState.guide) {
      this.centerGuide();
    }
  }

  @HostListener('document:mousemove', ['$event'])
  onDocumentMouseMove(event: MouseEvent): void {
    if (this.state().guide) {
      this.guideY.set(event.clientY);
    }
  }

  @HostListener('document:keydown.escape')
  onEscape(): void {
    this.closeMenu();
  }

  protected toggleMenu(): void {
    this.isOpen.update(isOpen => !isOpen);
  }

  protected closeMenu(): void {
    this.isOpen.set(false);
  }

  protected toggleHighContrast(): void {
    const currentState = this.state();
    const highContrast = !currentState.highContrast;

    this.commitState({
      ...currentState,
      highContrast,
      darkMode: highContrast ? false : currentState.darkMode
    });
  }

  protected toggleDarkMode(): void {
    const currentState = this.state();
    const darkMode = !currentState.darkMode;

    this.commitState({
      ...currentState,
      darkMode,
      highContrast: darkMode ? false : currentState.highContrast
    });
  }

  protected increaseFont(): void {
    const currentState = this.state();

    this.commitState({
      ...currentState,
      fontScale: this.normalizeFontScale(currentState.fontScale + FONT_STEP)
    });
  }

  protected resetFont(): void {
    this.commitState({
      ...this.state(),
      fontScale: DEFAULT_STATE.fontScale
    });
  }

  protected decreaseFont(): void {
    const currentState = this.state();

    this.commitState({
      ...currentState,
      fontScale: this.normalizeFontScale(currentState.fontScale - FONT_STEP)
    });
  }

  protected toggleMarker(): void {
    const currentState = this.state();

    this.commitState({
      ...currentState,
      marker: !currentState.marker
    });
  }

  protected toggleGuide(): void {
    const currentState = this.state();
    const guide = !currentState.guide;

    if (guide) {
      this.centerGuide();
    }

    this.commitState({
      ...currentState,
      guide
    });
  }

  protected resetPreferences(): void {
    const defaultState = { ...DEFAULT_STATE };

    this.state.set(defaultState);
    this.applyState(defaultState);
    this.removeStoredState();
  }

  private commitState(state: AccessibilityState): void {
    this.state.set(state);
    this.applyState(state);
    this.saveState(state);
  }

  private applyState(state: AccessibilityState): void {
    const body = this.document.body;
    const root = this.document.documentElement;

    body.classList.toggle('mff-high-contrast', state.highContrast);
    body.classList.toggle('mff-dark-mode', state.darkMode);
    body.classList.toggle('mff-reading-marker', state.marker);
    root.style.setProperty('--mff-font-scale', state.fontScale.toString());
  }

  private loadState(): AccessibilityState {
    const storage = this.getStorage();

    if (!storage) {
      return { ...DEFAULT_STATE };
    }

    try {
      const rawState = storage.getItem(STORAGE_KEY);

      if (!rawState) {
        return { ...DEFAULT_STATE };
      }

      const parsedState: unknown = JSON.parse(rawState);
      return this.normalizeStoredState(parsedState) ?? { ...DEFAULT_STATE };
    } catch {
      return { ...DEFAULT_STATE };
    }
  }

  private saveState(state: AccessibilityState): void {
    const storage = this.getStorage();

    if (!storage) {
      return;
    }

    try {
      storage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      return;
    }
  }

  private removeStoredState(): void {
    const storage = this.getStorage();

    if (!storage) {
      return;
    }

    try {
      storage.removeItem(STORAGE_KEY);
    } catch {
      return;
    }
  }

  private getStorage(): Storage | null {
    const defaultView = this.document.defaultView;

    if (!defaultView) {
      return null;
    }

    try {
      return defaultView.localStorage;
    } catch {
      return null;
    }
  }

  private normalizeStoredState(value: unknown): AccessibilityState | null {
    if (!this.isRecord(value)) {
      return null;
    }

    const highContrast = value['highContrast'];
    const darkMode = value['darkMode'];
    const fontScale = value['fontScale'];
    const marker = value['marker'];
    const guide = value['guide'];

    if (
      typeof highContrast !== 'boolean' ||
      typeof darkMode !== 'boolean' ||
      typeof fontScale !== 'number' ||
      typeof marker !== 'boolean' ||
      typeof guide !== 'boolean'
    ) {
      return null;
    }

    return {
      highContrast,
      darkMode: highContrast ? false : darkMode,
      fontScale: this.normalizeFontScale(fontScale),
      marker,
      guide
    };
  }

  private normalizeFontScale(value: number): number {
    const clampedValue = Math.min(MAX_FONT_SCALE, Math.max(MIN_FONT_SCALE, value));

    return Math.round(clampedValue * 100) / 100;
  }

  private isRecord(value: unknown): value is Record<string, unknown> {
    return typeof value === 'object' && value !== null;
  }

  private centerGuide(): void {
    const defaultView = this.document.defaultView;
    const viewportHeight = defaultView?.innerHeight ?? 0;

    this.guideY.set(Math.round(viewportHeight / 2));
  }
}
