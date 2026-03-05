import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  {
    path: 'home',
    loadComponent: () => import('./features/home/home').then(m => m.HomeComponent),
  },
  {
    path: 'analyse',
    loadComponent: () => import('./features/analyse/analyse').then(m => m.AnalyseComponent),
  },
  {
    path: 'auto',
    loadComponent: () => import('./features/auto/auto').then(m => m.AutoComponent),
  },
  {
    path: 'oepnv',
    loadComponent: () => import('./features/oepnv/oepnv').then(m => m.OepnvComponent),
  },
  {
    path: 'jobrad',
    loadComponent: () => import('./features/jobrad/jobrad').then(m => m.JobradComponent),
  },
  {
    path: 'e-scooter',
    loadComponent: () => import('./features/e-scooter/e-scooter').then(m => m.EScooterComponent),
  },
  { path: '**', redirectTo: 'home' },
];
