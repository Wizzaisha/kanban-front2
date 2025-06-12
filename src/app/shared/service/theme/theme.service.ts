import { isPlatformBrowser } from '@angular/common';
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ThemeService {
  private themeKey = 'theme';

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {
    this.loadTheme();
  }

  getCurrentTheme(): 'light' | 'dark' | null {
    if (isPlatformBrowser(this.platformId)) {
      return localStorage.getItem(this.themeKey) as 'light' | 'dark';
    }
    return null;
  }

  setTheme(theme: 'light' | 'dark'): void {
    document.documentElement.setAttribute('data-theme', theme);
    document.documentElement.setAttribute('class', theme);

    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem(this.themeKey, theme);
    }
  }

  loadTheme(): void {
    if (isPlatformBrowser(this.platformId)) {
      const savedTheme = localStorage.getItem(this.themeKey) as
        | 'light'
        | 'dark';
      if (savedTheme) {
        this.setTheme(savedTheme);
      }
    }
  }

  toggleTheme(): void {
    const currentTheme =
      document.documentElement.getAttribute('data-theme') === 'light'
        ? 'dark'
        : 'light';
    this.setTheme(currentTheme);
  }
}
