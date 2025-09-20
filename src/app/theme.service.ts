import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class ThemeControllerService {
  private themeKey = 'theme';

  constructor() {
    this.setTheme(this.getTheme());
  }

  toggleTheme() {
    this.setTheme(this.getTheme() === 'dark' ? 'light' : 'dark');
  }

  getTheme(): 'light' | 'dark' {
    return (localStorage.getItem(this.themeKey) || 'light') as 'light' | 'dark';
  }

  setTheme(theme: 'light' | 'dark') {
    localStorage.setItem(this.themeKey, theme);
    document.documentElement.setAttribute('data-theme', theme);
  }
}
