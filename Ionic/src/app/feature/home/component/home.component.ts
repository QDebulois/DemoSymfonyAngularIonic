import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { IonHeader, IonToolbar, IonTitle, IonContent, IonCard, IonCardHeader, IonCardSubtitle, IonList, IonItem, IonLabel, IonIcon } from '@ionic/angular/standalone';

import { AuthService } from 'src/app/core/service/auth.service';
import { addIcons } from 'ionicons';
import { bug, qrCode } from 'ionicons/icons';
import { CustomerService } from '../../gift-card/service/customer.service';

type State = {
  debugResponse: any;
};

@Component({
  selector: 'app-home',
  imports: [
    CommonModule,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonCard,
    IonCardHeader,
    IonCardSubtitle,
    IonList,
    IonItem,
    IonLabel,
    IonIcon
],
  template: `
    <ion-header [translucent]="true">
      <ion-toolbar>
        <ion-title>Accueil</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content [fullscreen]="true" color="light" class="ion-padding">

      <ion-card>
        <ion-card-header>
          <ion-card-subtitle>
            Role: {{ authService.tokenPayload()?.roles | json }}
          </ion-card-subtitle>
        </ion-card-header>
      </ion-card>

      <ion-list [inset]="true">
        <ion-item [button]="true" (click)="debug()">
          <ion-icon slot="start" name="bug"></ion-icon>
          <ion-label>Debug</ion-label>
        </ion-item>
      </ion-list>

    </ion-content>
  `,
  styles: ``,
})
export class HomeComponent {
  authService = inject(AuthService);

  customerService = inject(CustomerService);

  state = signal<State>({
    debugResponse: null,
  });

  constructor() {
    addIcons({ bug });
  }

  debug() {
    this.customerService.all().subscribe(res => console.log(res));
  }
}
