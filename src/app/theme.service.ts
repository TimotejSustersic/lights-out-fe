import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class ThemeControllerService {
  private themeKey = 'theme';

  constructor() {
    this.loadTheme();
  }

  toggleTheme() {
    const current = this.getTheme();
    const next = current === 'dark' ? 'light' : 'dark';
    this.setTheme(next);
  }

  getTheme(): 'light' | 'dark' {
    return (localStorage.getItem(this.themeKey) as 'light' | 'dark') || 'light';
  }

  setTheme(theme: 'light' | 'dark') {
    localStorage.setItem(this.themeKey, theme);
    document.documentElement.setAttribute('data-theme', theme); // DaisyUI uses data-theme
  }

  private loadTheme() {
    this.setTheme(this.getTheme());
  }
}
