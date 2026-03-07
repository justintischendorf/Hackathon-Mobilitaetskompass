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
    path: 'fahrrad',
    loadComponent: () => import('./features/fahrrad/fahrrad').then(m => m.FahrradComponent),
  },
  {
    path: 'e-scooter',
    loadComponent: () => import('./features/e-scooter/e-scooter').then(m => m.EScooterComponent),
  },
  {
    path: 'carsharing',
    loadComponent: () => import('./features/carsharing/carsharing').then(m => m.CarsharingComponent),
  },
  {
    path: 'uber',
    loadComponent: () => import('./features/uber/uber').then(m => m.UberComponent),
  },
  { path: '**', redirectTo: 'home' },
];
