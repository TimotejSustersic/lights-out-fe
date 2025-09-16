import { ApplicationConfig } from '@angular/core';
import { provideRouter, Routes } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { Problems } from './pages/problems/problems';
import { NewProblem } from './pages/new-problem/new-problem';

const routes: Routes = [
  { path: '', redirectTo: '/problems', pathMatch: 'full' },
  { path: 'problems', component: Problems },
  { path: 'new', component: NewProblem }
];

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideHttpClient()
  ]
};
