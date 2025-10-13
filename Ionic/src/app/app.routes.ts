import { Routes } from '@angular/router';
import { TabsComponent } from './shared/feature/tabs/tabs.component';

export const routes: Routes = [
  {
    path: 'app',
    component: TabsComponent,
    children: [
      {
        path: 'home',
        loadComponent: () => import('./feature/home/home.component').then(m => m.HomeComponent),
      },
      {
        path: 'gift-card',
        loadComponent: () => import('./feature/gift-card/gift-card.component').then(m => m.GiftCardComponent),
      },
      {
        path: 'profile',
        loadComponent: () => import('./feature/profile/profile.component').then(m => m.ProfileComponent),
      },
      {
        path: '',
        redirectTo: '/app/home',
        pathMatch: 'full',
      },
    ],
  },
  {
    path: '',
    redirectTo: '/app/home',
    pathMatch: 'full',
  },
];
