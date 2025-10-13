import { Component } from '@angular/core';
import { IonTabs, IonTabBar, IonTabButton, IonLabel } from '@ionic/angular/standalone';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-tabs',
  imports: [IonTabs, IonTabBar, IonTabButton, IonLabel, MatIconModule],
  template: `
    <ion-tabs>
      <ion-tab-bar slot="bottom">
        <ion-tab-button tab="home" href="/app/home">
          <mat-icon aria-hidden="false" aria-label="" fontIcon="home"></mat-icon>
          <ion-label>Accueil</ion-label>
        </ion-tab-button>

        <ion-tab-button tab="gift-card" href="/app/gift-card">
          <mat-icon aria-hidden="false" aria-label="" fontIcon="redeem"></mat-icon>
          <ion-label>Chèques Cadeaux</ion-label>
        </ion-tab-button>

        <ion-tab-button tab="profile" href="/app/profile">
          <mat-icon aria-hidden="false" aria-label="" fontIcon="person"></mat-icon>
          <ion-label>Profil</ion-label>
        </ion-tab-button>
      </ion-tab-bar>
    </ion-tabs>
  `,
  styles: ``,
})
export class TabsComponent {}
