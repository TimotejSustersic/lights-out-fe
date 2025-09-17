import { ApplicationConfig } from '@angular/core';
import { provideRouter, Routes } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';

import { ProblemsComponent } from './pages/problems/problems.component';
import { SolutionsComponent } from './pages/solutions/solutions.component';

const routes: Routes = [
  { path: '', redirectTo: '/problems', pathMatch: 'full' },
  { path: 'problems', component: ProblemsComponent },
  { path: 'solutions', component: SolutionsComponent }
];

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideHttpClient()
  ]
};
