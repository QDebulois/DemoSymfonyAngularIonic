import { HttpClient } from '@angular/common/http';
import { Component, inject, signal, viewChild } from '@angular/core';
import { IonHeader, IonToolbar, IonTitle, IonContent, IonButton, IonCard, IonCardHeader, IonCardSubtitle, IonButtons, IonModal, IonList, IonItem, IonLabel, IonIcon, IonSelect, IonSelectOption } from '@ionic/angular/standalone';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { CapacitorBarcodeScanner, CapacitorBarcodeScannerTypeHint } from '@capacitor/barcode-scanner';
import { AuthService } from 'src/app/core/service/auth.service';
import { RoleService } from 'src/app/shared/service/role.service';
import { OverlayEventDetail } from '@ionic/core/components';
import { GiftCardResponseDto, GiftCardService } from '../service/gift-card.service';
import { CustomerResponseDto, CustomerService } from '../service/customer.service';
import { addIcons } from 'ionicons';
import { bug, qrCode } from 'ionicons/icons';

type State = {
  giftCardInfos: GiftCardResponseDto | null;
  qrCodeValue: string | null;
  customers: CustomerResponseDto[];
  customer: CustomerResponseDto | null;
};

@Component({
  selector: 'app-gift-card',
  imports: [
    CommonModule,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonCardHeader,
    IonCardSubtitle,
    IonContent,
    IonButton,
    IonCard,
    MatIconModule,
    IonModal,
    IonButtons,
    IonList,
    IonItem,
    IonLabel,
    IonIcon,
    IonSelect,
    IonSelectOption
],
  template: `
    <ion-header [translucent]="true">
      <ion-toolbar>
        <ion-title> Chèques Cadeaux </ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content [fullscreen]="true" color="light" class="ion-padding">
      <ion-card>
        <ion-card-header>
          <ion-card-subtitle> Role: {{ authService.tokenPayload()?.roles | json }} </ion-card-subtitle>
        </ion-card-header>
      </ion-card>
      <ion-card>
        <ion-card-header>
          <ion-card-subtitle> Gift Card Infos: {{ state().giftCardInfos | json }} </ion-card-subtitle>
        </ion-card-header>
      </ion-card>
      <ion-list [inset]="true">
        <ion-item [button]="true" (click)="debug()">
          <ion-icon name="bug"></ion-icon>
          <ion-label>Debug</ion-label>
        </ion-item>
      </ion-list>
      <ion-list [inset]="true">
        <ion-item [button]="true" (click)="infos()">
          <ion-icon name="qr-code"></ion-icon>
          <ion-label>Infos</ion-label>
        </ion-item>
        @if (roleService.isGrantedSeller()) {
          <ion-item [button]="true" (click)="debug()">
            <ion-icon name="qr-code"></ion-icon>
            <ion-label>Vendre</ion-label>
          </ion-item>
        }
        @if (roleService.isGrantedRedeemer()) {
          <ion-item  [button]="true" (click)="debug()">
            <ion-icon name="qr-code"></ion-icon>
            <ion-label>Débiter</ion-label>
          </ion-item>
        }
        @if (roleService.isGrantedCustomer()) {
          <ion-item [button]="true" (click)="debug()">
            <ion-icon name="qr-code"></ion-icon>
            <ion-label>Associer</ion-label>
          </ion-item>
        }
      </ion-list>

      <ion-modal trigger="open-modal" (willDismiss)="onWillDismiss($event)" (willPresent)="onWillPresent()">
        <ng-template>
          <ion-header>
            <ion-toolbar>
              <ion-buttons slot="start"><ion-button (click)="cancel()">Annuler</ion-button></ion-buttons>
              <ion-title>Validation</ion-title>
              <ion-buttons slot="end"><ion-button (click)="confirm()" [strong]="true">Valider</ion-button></ion-buttons>
            </ion-toolbar>
          </ion-header>
          <ion-content class="ion-padding" color="light">
            <!--
            <ion-item>
              <ion-input
                label="Enter your name"
                labelPlacement="stacked"
                type="text"
                placeholder="Your name"
                [(ngModel)]="name"
              ></ion-input>
            </ion-item>
            -->

            <ion-list [inset]="true">
              <ion-item>
                <ion-select label="Floating label" label-placement="floating" (ionChange)="handleChange($event)">
                  @for (customer of state().customers; track $index) {
                    <ion-select-option [value]="customer.email">{{ customer.email }}</ion-select-option>
                  }
                </ion-select>
              </ion-item>
            </ion-list>

          </ion-content>
        </ng-template>
      </ion-modal>
    </ion-content>
  `,
  styles: ``,
})
export class GiftCardComponent {
  // @ViewChild(IonModal) modal!: IonModal;

  modal = viewChild.required(IonModal);

  authService = inject(AuthService);
  httpClient = inject(HttpClient);

  roleService = inject(RoleService);
  giftCardService = inject(GiftCardService);
  customerService = inject(CustomerService);

  state = signal<State>({
    qrCodeValue: null,
    giftCardInfos: null,
    customers: [],
    customer: null,
  });

  constructor() {
    addIcons({ bug, qrCode });
  }

  open() {
    this.modal().present();
  }

  cancel() {
    this.modal().dismiss();
  }

  confirm() {
    this.modal().dismiss(null, 'confirm');
  }

  onWillPresent() {
    this.customerService.all().subscribe(res => this.state.update(s => ({ ...s, customers: res })));
  }

  onWillDismiss(event: CustomEvent<OverlayEventDetail>) {
    const role = event.detail.role;
    const qrCodeValue = this.state().qrCodeValue;
    const customer = this.state().customer;

    if (role === 'confirm' && qrCodeValue && customer) {
      this.giftCardService.sell(qrCodeValue, customer).subscribe();
    }

    this.state.update(s => ({ ...s, qrCodeValue: null, customers: [], customer: null }));
  }

  handleChange(event: Event) {
    const target = event.target as HTMLIonSelectElement;

    this.state.update(s => ({ ...s, customer: this.state().customers.find(c => c.email === target.value) ?? null }));
  }

  debug() {
    this.modal().present();
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

    this.modal().present();

    console.log(qrCodeValue);
  }

  private async scan() {
    try {
      const barcode = await CapacitorBarcodeScanner.scanBarcode({ hint: CapacitorBarcodeScannerTypeHint.QR_CODE });

      this.qrCodeValueSet(barcode.ScanResult);
    } catch (e) {
      this.qrCodeValueReset();
    }
  }

  private qrCodeValueSet(value: string) {
    this.state.update(s => ({ ...s, qrCodeValue: value }));
  }

  private qrCodeValueReset() {
    this.state.update(s => ({ ...s, qrCodeValue: null }));
  }
}
