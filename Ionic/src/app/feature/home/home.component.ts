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
import { CapacitorBarcodeScanner, CapacitorBarcodeScannerTypeHint } from '@capacitor/barcode-scanner';
import { MatIconModule } from '@angular/material/icon';

import { AuthService } from 'src/app/core/service/auth.service';
import { RoleService } from 'src/app/shared/service/role.service';
import { GiftCardResponseDto, GiftCardService } from '../gift-card/gift-card.service';
import { CustomerService } from '../gift-card/customer.service';

type State = {
  giftCardInfos: GiftCardResponseDto | null;
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
            <div>
              <ion-button color="primary" (click)="debug()">Debug</ion-button>
            </div>

            <span>Vous êtes connecté en tant que: {{ authService.tokenPayload()?.roles | json }}</span>

            <hr>

            <span>QR Code: {{ state().qrCodeValue | json }}</span>

            <span>Gift Card Infos: {{ state().giftCardInfos| json }}</span>

            <div>
              <ion-button color="primary" (click)="infos()"><mat-icon fontIcon="qr_code_scanner"></mat-icon> Infos</ion-button>
            </div>

            <hr>

            @if (roleService.isGrantedSeller()) {
              <span>Actions en tant que point de vente</span>

              <div>
                <ion-button color="primary" (click)="debug()"><mat-icon fontIcon="qr_code_scanner"></mat-icon> Vendre</ion-button>
              </div>
            }

            @if (roleService.isGrantedRedeemer()) {
              <span>Actions en tant que point d'utilisation</span>

              <div>
                <ion-button color="primary" (click)="debug()"
                  ><mat-icon fontIcon="qr_code_scanner"></mat-icon> Débiter</ion-button
                >
              </div>
            }

            @if (roleService.isGrantedCustomer()) {
              <span>Actions en tant que client</span>

              <div>
                <ion-button color="primary" (click)="debug()"
                  ><mat-icon fontIcon="qr_code_scanner"></mat-icon> Associer</ion-button
                >
              </div>
            }
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

  roleService = inject(RoleService);
  giftCardService = inject(GiftCardService);
  customerService = inject(CustomerService);

  state = signal<State>({
    giftCardInfos: null,
    qrCodeValue: null,
    debugResponse: null,
  });

  constructor() {}

  debug() {
    this.customerService.all().subscribe();
  }

  async infos() {
    await this.scan();

    const qrCodeValue = this.state().qrCodeValue;

    if (!qrCodeValue) return;

    this.giftCardService.infos(qrCodeValue).subscribe(res => this.state.update(s => ({ ...s, giftCardInfos: res })));
  }

  async sell() {
    await this.scan();

    if (!this.state().qrCodeValue) {
      return;
    }
  }

  private async scan() {
    const barcode = await CapacitorBarcodeScanner.scanBarcode({ hint: CapacitorBarcodeScannerTypeHint.QR_CODE });

    this.state.update(s => ({ ...s, qrCodeValue: barcode.ScanResult }));
  }
}
