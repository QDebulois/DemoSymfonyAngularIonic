import { Component } from '@angular/core';
import { IonHeader, IonToolbar, IonTitle, IonContent } from '@ionic/angular/standalone';

@Component({
  selector: 'app-tab1',
  imports: [IonHeader, IonToolbar, IonTitle, IonContent],
  template: `
    <ion-header [translucent]="true">
      <ion-toolbar>
        <ion-title>
          Tab 1
        </ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content [fullscreen]="true">
      <ion-header collapse="condense">
        <ion-toolbar>
          <ion-title size="large">Tab 1</ion-title>
        </ion-toolbar>
      </ion-header>
    </ion-content>
  `,
  styles: ``,
})
export class Tab1Component {
  constructor() {}
}
