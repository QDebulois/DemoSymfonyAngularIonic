import { HttpClient } from '@angular/common/http';
import { Component, inject, signal } from '@angular/core';
import { IonHeader, IonToolbar, IonTitle, IonContent, IonButton, IonCardContent, IonCard, IonCardHeader, IonCardTitle, IonCardSubtitle, IonText } from '@ionic/angular/standalone';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { CapacitorBarcodeScanner, CapacitorBarcodeScannerTypeHint } from '@capacitor/barcode-scanner';
import { AuthService } from 'src/app/core/service/auth.service';
import { RoleService } from 'src/app/shared/service/role.service';
import { CustomerService } from './customer.service';
import { GiftCardResponseDto, GiftCardService } from './gift-card.service';

type State = {
  giftCardInfos: GiftCardResponseDto | null;
  qrCodeValue: string | null;
};

@Component({
  selector: 'app-gift-card',
  imports: [
    CommonModule,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonCardHeader,
    IonCardTitle,
    IonCardSubtitle,
    IonContent,
    IonButton,
    IonCard,
    IonCardContent,
    MatIconModule,
    IonText
],
  template: `
    <ion-header [translucent]="true">
      <ion-toolbar>
        <ion-title> Chèques Cadeaux </ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content [fullscreen]="true">
      <ion-card>
        <ion-card-header>
          <ion-card-title>Gestion</ion-card-title>
          <ion-card-subtitle>Gérer les chèques cadeaux</ion-card-subtitle>
        </ion-card-header>

        <ion-card-content>
          <main class="ion-display-flex ion-flex-column">
            <ion-text>Role: {{ authService.tokenPayload()?.roles | json }}</ion-text>

            <ion-text>Gift Card Infos: {{ state().giftCardInfos | json }}</ion-text>

            <div>
              <ion-button color="primary" (click)="infos()"><mat-icon fontIcon="qr_code_scanner"></mat-icon> Infos</ion-button>
            </div>

            @if (roleService.isGrantedSeller()) {
              <ion-text>Actions en tant que point de vente</ion-text>

              <div>
                <ion-button color="primary" (click)="debug()"><mat-icon fontIcon="qr_code_scanner"></mat-icon> Vendre</ion-button>
              </div>
            }

            @if (roleService.isGrantedRedeemer()) {
              <ion-text>Actions en tant que point d'utilisation</ion-text>

              <div>
                <ion-button color="primary" (click)="debug()"><mat-icon fontIcon="qr_code_scanner"></mat-icon> Débiter</ion-button>
              </div>
            }

            @if (roleService.isGrantedCustomer()) {
              <ion-text>Actions en tant que client</ion-text>

              <div>
                <ion-button color="primary" (click)="debug()"><mat-icon fontIcon="qr_code_scanner"></mat-icon> Associer</ion-button>
              </div>
            }
          </main>
        </ion-card-content>
      </ion-card>
    </ion-content>
  `,
  styles: ``,
})
export class GiftCardComponent {
  authService = inject(AuthService);
  httpClient = inject(HttpClient);

  roleService = inject(RoleService);
  giftCardService = inject(GiftCardService);
  customerService = inject(CustomerService);

  state = signal<State>({
    qrCodeValue: null,
    giftCardInfos: null,
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

    const qrCodeValue = this.state().qrCodeValue;

    if (!qrCodeValue) return;

    console.log(qrCodeValue);
  }

  private async scan() {
    try {
      const barcode = await CapacitorBarcodeScanner.scanBarcode({ hint: CapacitorBarcodeScannerTypeHint.QR_CODE });

      console.log('OK');

      console.log(barcode);

      this.state.update(s => ({ ...s, qrCodeValue: barcode.ScanResult }));
    } catch (e) {
      console.log('CATCHED');

      console.error(e);
    }
  }
}
