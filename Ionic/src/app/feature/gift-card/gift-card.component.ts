import { Component } from '@angular/core';
import { IonHeader, IonToolbar, IonTitle, IonContent } from '@ionic/angular/standalone';

@Component({
  selector: 'app-gift-card',
  imports: [IonHeader, IonToolbar, IonTitle, IonContent],
  template: `
    <ion-header [translucent]="true">
      <ion-toolbar>
        <ion-title> Chèques Cadeaux </ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content [fullscreen]="true">

    </ion-content>
  `,
  styles: ``,
})
export class GiftCardComponent {
  constructor() {}
}
