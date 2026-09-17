import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', redirectTo: 'email/dashboard', pathMatch: 'full' },
  {
    path: 'email/dashboard',
    loadComponent: () => import('./features/dashboard/dashboard.component')
      .then(m => m.DashboardComponent),
    title: 'Email Service — Dashboard'
  },
  {
    path: 'email/logs',
    loadComponent: () => import('./features/email-logs/email-logs.component')
      .then(m => m.EmailLogsComponent),
    title: 'Email Service — Logs'
  },
  {
    path: 'email/test',
    loadComponent: () => import('./features/email-test/email-test.component')
      .then(m => m.EmailTestComponent),
    title: 'Email Service — Test envoi'
  },
  { path: '**', redirectTo: 'email/dashboard' }
];
