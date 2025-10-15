import { HttpClient } from '@angular/common/http';
import { Component, inject, signal, viewChild } from '@angular/core';
import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonButton,
  IonCard,
  IonCardHeader,
  IonCardSubtitle,
  IonButtons,
  IonModal,
  IonList,
  IonItem,
  IonLabel,
  IonIcon,
  IonSelect,
  IonSelectOption,
  IonInput,
  IonListHeader,
} from '@ionic/angular/standalone';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { CapacitorBarcodeScanner, CapacitorBarcodeScannerTypeHint } from '@capacitor/barcode-scanner';
import { AuthService } from 'src/app/core/service/auth.service';
import { RoleService } from 'src/app/shared/service/role.service';
import { OverlayEventDetail } from '@ionic/core/components';
import { GiftCardResponseDto, GiftCardService, RedeemRequestDto } from '../service/gift-card.service';
import { CustomerRequestDto, CustomerResponseDto, CustomerService } from '../service/customer.service';
import { addIcons } from 'ionicons';
import { bug, qrCode } from 'ionicons/icons';

type State = {
  giftCardInfos: GiftCardResponseDto | null;
  qrCodeValue: string | null;
};

type ModalState = {
  modalType: ModalType | null;
  customers: CustomerResponseDto[];
  selectedCustomer: CustomerRequestDto | null;
  selectedAmount: RedeemRequestDto | null;
};

enum ModalType {
  Sell,
  Redeem,
  Associate,
}

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
    IonSelectOption,
    IonInput,
    IonListHeader,
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
      <ion-list [inset]="true">
        <ion-list-header>
          <ion-label>Chèques cadeaux infos</ion-label>
        </ion-list-header>
        @let giftcard = state().giftCardInfos;
        @if (!giftcard) {
          <ion-item>
            <ion-label>Scannez le code</ion-label>
          </ion-item>
        } @else {
          <ion-item>
            <ion-label>Code: {{ giftcard.code }}</ion-label>
          </ion-item>
          <ion-item>
            <ion-label>Initial: {{ giftcard.initialAmount }}</ion-label>
          </ion-item>
          <ion-item>
            <ion-label>Restant: {{ giftcard.remainingAmount }}</ion-label>
          </ion-item>
          <ion-item>
            <ion-label>Vendu par: {{ giftcard.onSaleBy }}</ion-label>
          </ion-item>
          <ion-item>
            <ion-label>Acheté par: {{ giftcard.boughtBy }}</ion-label>
          </ion-item>
          <ion-item>
            <ion-label>Associé à: {{ giftcard.associatedTo }}</ion-label>
          </ion-item>
        }
      </ion-list>
      <ion-list [inset]="true">
        <ion-item [button]="true" (click)="infos()">
          <ion-icon name="qr-code"></ion-icon>
          <ion-label>Infos</ion-label>
        </ion-item>
      </ion-list>
      <ion-list [inset]="true">
        @if (roleService.isGrantedSeller()) {
          <ion-item [button]="true" (click)="sell()">
            <ion-icon name="qr-code"></ion-icon>
            <ion-label>Vendre</ion-label>
          </ion-item>
        }
        @if (roleService.isGrantedCustomer()) {
          <ion-item [button]="true" (click)="associate()">
            <ion-icon name="qr-code"></ion-icon>
            <ion-label>Associer</ion-label>
          </ion-item>
        }
        @if (roleService.isGrantedRedeemer()) {
          <ion-item [button]="true" (click)="redeem()">
            <ion-icon name="qr-code"></ion-icon>
            <ion-label>Débiter</ion-label>
          </ion-item>
        }
      </ion-list>

      <ion-modal (willPresent)="modalOnWillPresent()" (willDismiss)="modalOnWillDismiss($event)">
        <ng-template>
          <ion-header>
            <ion-toolbar>
              <ion-buttons slot="start"><ion-button (click)="modalCancel()">Annuler</ion-button></ion-buttons>
              <ion-title>Validation</ion-title>
              <ion-buttons slot="end"><ion-button (click)="modalConfirm()" [strong]="true">Valider</ion-button></ion-buttons>
            </ion-toolbar>
          </ion-header>
          <ion-content class="ion-padding" color="light">
            <ion-list [inset]="true">
              <ion-item>
                @if (modalState().modalType === ModalType.Sell || modalState().modalType === ModalType.Associate) {
                  <ion-select label="Email" label-placement="floating" (ionChange)="modalCustomersHandleChange($event)">
                    @for (customer of modalState().customers; track $index) {
                      <ion-select-option [value]="customer.email">{{ customer.email }}</ion-select-option>
                    }
                  </ion-select>
                } @else if (modalState().modalType === ModalType.Redeem) {
                  <ion-input label="Montant" type="number" (ionChange)="modalRedeemHandleChange($event)"></ion-input>
                }
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
  modal = viewChild.required(IonModal);

  authService = inject(AuthService);
  httpClient = inject(HttpClient);

  roleService = inject(RoleService);
  giftCardService = inject(GiftCardService);
  customerService = inject(CustomerService);

  state = signal<State>({
    qrCodeValue: null,
    giftCardInfos: null,
  });

  modalState = signal<ModalState>({
    modalType: null,
    customers: [],
    selectedCustomer: null,
    selectedAmount: null,
  });

  ModalType = ModalType;

  constructor() {
    addIcons({ bug, qrCode });
  }

  modalOpen() {
    this.modal().present();
  }

  modalCancel() {
    this.modal().dismiss();
  }

  modalConfirm() {
    this.modal().dismiss(null, 'confirm');
  }

  modalOnWillPresent() {
    const modalType = this.modalState().modalType;

    if (modalType === ModalType.Sell || modalType === ModalType.Associate) {
      this.customerService.all().subscribe(res => this.state.update(s => ({ ...s, customers: res })));
    }
  }

  modalOnWillDismiss(event: CustomEvent<OverlayEventDetail>) {
    const qrCodeValue = this.state().qrCodeValue;

    if (event.detail.role !== 'confirm' || !qrCodeValue) {
      this.state.update(s => ({ ...s, qrCodeValue: null, customers: [], customer: null }));

      return;
    }

    const modalType = this.modalState().modalType;

    if (modalType === ModalType.Sell) {
      const customer = this.modalState().selectedCustomer;

      if (!customer) return;

      this.giftCardService.sell(qrCodeValue, customer).subscribe();
    } else if (modalType === ModalType.Associate) {
      const customer = this.modalState().selectedCustomer;

      if (!customer) return;

      this.giftCardService.associate(qrCodeValue, customer).subscribe();
    } else if (modalType === ModalType.Redeem) {
      const amount = this.modalState().selectedAmount;

      if (!amount) return;

      this.giftCardService.redeem(qrCodeValue, amount).subscribe();
    }

    this.statesReset();
  }

  modalCustomersHandleChange(event: Event) {
    const customer = this.modalState().customers.find(c => c.email === (event.target as HTMLIonSelectElement).value);

    this.modalState.update(s => ({ ...s, selectedCustomer: customer ? (customer as CustomerRequestDto) : null }));
  }

  modalRedeemHandleChange(event: Event) {
    let value = (event.target as HTMLIonInputElement).value ?? null;

    if (typeof value === 'string') value = parseInt(value);
    if (typeof value === 'number') value = Math.floor(value);

    this.modalState.update(s => ({ ...s, selectedAmount: value ? ({ amount: value } as RedeemRequestDto) : null }));
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

    this.modalState.update(s => ({ ...s, modalType: ModalType.Sell }));

    this.modal().present();
  }

  async associate() {
    await this.scan();

    const qrCodeValue = this.state().qrCodeValue;

    if (!qrCodeValue) return;

    this.modalState.update(s => ({ ...s, modalType: ModalType.Associate }));

    this.modal().present();
  }

  async redeem() {
    await this.scan();

    const qrCodeValue = this.state().qrCodeValue;

    if (!qrCodeValue) return;

    this.modalState.update(s => ({ ...s, modalType: ModalType.Redeem }));

    this.modal().present();
  }

  private async scan() {
    try {
      const barcode = await CapacitorBarcodeScanner.scanBarcode({ hint: CapacitorBarcodeScannerTypeHint.QR_CODE });

      this.state.update(s => ({ ...s, qrCodeValue: barcode.ScanResult }));
    } catch (e) {
      this.statesReset();
    }
  }

  private statesReset() {
    this.state.update(s => ({ ...s, qrCodeValue: null, giftCardInfos: null }));

    this.modalState.update(s => ({ ...s, modalType: null, customers: [], selectedCustomer: null }));
  }
}
