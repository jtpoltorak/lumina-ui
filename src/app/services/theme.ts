import {
  Injectable,
  signal,
  effect,
  Inject,
} from '@angular/core';
import { DOCUMENT } from '@angular/common';

@Injectable({
  providedIn: 'root',
})
export class ThemeService {
  isDarkMode = signal<boolean>(true);

  constructor(@Inject(DOCUMENT) private document: Document) {
    this.initializeTheme();
  }

  private initializeTheme() {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      this.setTheme(savedTheme === 'dark');
    } else {
      const prefersDark = window.matchMedia(
        '(prefers-color-scheme: dark)',
      ).matches;
      this.setTheme(prefersDark);
    }
  }

  toggleTheme() {
    this.setTheme(!this.isDarkMode());
  }

  private setTheme(isDark: boolean) {
    this.isDarkMode.set(isDark);
    const theme = isDark ? 'dark' : 'light';
    this.document.body.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }
}
