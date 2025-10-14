import { Routes } from '@angular/router';
import { TabsComponent } from './shared/feature/tabs/tabs.component';

export const routes: Routes = [
  {
    path: 'app',
    component: TabsComponent,
    children: [
      {
        path: 'home',
        loadComponent: () => import('./feature/home/component/home.component').then(m => m.HomeComponent),
      },
      {
        path: 'gift-card',
        loadComponent: () => import('./feature/gift-card/component/gift-card.component').then(m => m.GiftCardComponent),
      },
      {
        path: 'profile',
        loadComponent: () => import('./feature/profile/component/profile.component').then(m => m.ProfileComponent),
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
