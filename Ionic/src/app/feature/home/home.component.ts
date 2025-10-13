import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, inject, signal } from '@angular/core';
import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonButton,
  IonCard,
  IonCardTitle,
  IonCardHeader,
  IonCardSubtitle,
  IonCardContent,
} from '@ionic/angular/standalone';
import {
  CapacitorBarcodeScanner,
  CapacitorBarcodeScannerOptions,
  CapacitorBarcodeScannerTypeHint,
} from '@capacitor/barcode-scanner';
import { MatIconModule } from '@angular/material/icon';

import { AuthService } from 'src/app/core/service/auth.service';
import { environment } from 'src/environments/environment';

type State = {
  qrCodeValue: string | null;
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
    MatIconModule,
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
          <main>
            <span>Vous êtes connecté en tant que: {{ authService.tokenPayload()?.roles | json }}</span>

            <span>QR Code: {{ state().qrCodeValue | json }}</span>

            <div>
              <ion-button
                color="primary"
                [disabled]="authService.state().tokenPayload === null"
                (click)="scan()"
              >
                <mat-icon fontIcon="qr_code_scanner"></mat-icon>
              </ion-button>
            </div>
          </main>
        </ion-card-content>
      </ion-card>
    </ion-content>
  `,
  styles: `
    main {
      display: flex;
      flex-direction: column;
      gap: 12px;
    }
  `,
})
export class HomeComponent {
  authService = inject(AuthService);
  httpClient = inject(HttpClient);

  state = signal<State>({
    qrCodeValue: null,
    debugResponse: null,
  });

  constructor() {}

  scan() {
    const options: CapacitorBarcodeScannerOptions = { hint: CapacitorBarcodeScannerTypeHint.QR_CODE };

    CapacitorBarcodeScanner.scanBarcode(options).then(barcode =>
      this.state.update(s => ({ ...s, qrCodeValue: barcode.ScanResult }))
    );
  }
}
