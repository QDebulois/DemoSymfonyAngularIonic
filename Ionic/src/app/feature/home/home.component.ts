import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, inject, signal } from '@angular/core';
import { IonHeader, IonToolbar, IonTitle, IonContent, IonButton, IonCard, IonCardTitle, IonCardHeader, IonCardSubtitle, IonCardContent, IonText } from '@ionic/angular/standalone';
import { CapacitorBarcodeScanner, CapacitorBarcodeScannerTypeHint } from '@capacitor/barcode-scanner';
import { MatIconModule } from '@angular/material/icon';

import { AuthService } from 'src/app/core/service/auth.service';
import { RoleService } from 'src/app/shared/service/role.service';
import { GiftCardResponseDto, GiftCardService } from '../gift-card/gift-card.service';
import { CustomerService } from '../gift-card/customer.service';

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
    IonButton,
    IonCard,
    IonCardHeader,
    IonCardTitle,
    IonCardSubtitle,
    IonCardContent,
    IonText
],
  template: `
    <ion-header [translucent]="true">
      <ion-toolbar>
        <ion-title> Accueil </ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content [fullscreen]="true">
      <ion-card>
        <ion-card-header>
          <ion-card-title>Accueil</ion-card-title>
          <ion-card-subtitle>Bienvenue</ion-card-subtitle>
        </ion-card-header>

        <ion-card-content>
          <main class="ion-display-flex ion-flex-column">

            <ion-text>Role: {{ authService.tokenPayload()?.roles | json }}</ion-text>

            <div>
              <ion-button color="primary" (click)="debug()">Debug</ion-button>
            </div>

          </main>
        </ion-card-content>
      </ion-card>
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

  constructor() {}

  debug() {
    this.customerService.all().subscribe();
  }
}
