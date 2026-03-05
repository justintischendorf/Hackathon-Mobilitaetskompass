import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', redirectTo: 'analyse', pathMatch: 'full' },
  {
    path: 'analyse',
    loadComponent: () =>
      import('./features/analyse/analyse').then((m) => m.AnalyseComponent),
  },
];
