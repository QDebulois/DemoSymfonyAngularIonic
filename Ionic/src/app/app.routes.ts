import { Routes } from '@angular/router';
import { TabsComponent } from './shared/feature/tabs/tabs.component';

export const routes: Routes = [
  {
    path: 'app',
    component: TabsComponent,
    children: [
      {
        path: 'tab1',
        loadComponent: () => import('./feature/tab1/tab1.component').then(m => m.Tab1Component),
      },
      {
        path: 'tab2',
        loadComponent: () => import('./feature/tab2/tab2.component').then(m => m.Tab2Component),
      },
      {
        path: '',
        redirectTo: '/app/tab1',
        pathMatch: 'full',
      },
    ],
  },
  {
    path: '',
    redirectTo: '/app/tab1',
    pathMatch: 'full',
  },
];
