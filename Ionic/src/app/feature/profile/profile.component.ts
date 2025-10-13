import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
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
import { AuthService } from 'src/app/core/service/auth.service';

@Component({
  selector: 'app-profile',
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
  ],
  template: `
    <ion-header [translucent]="true">
      <ion-toolbar>
        <ion-title> Profil </ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content [fullscreen]="true">
      <ion-card>
        <ion-card-header>
          <ion-card-title>Profil</ion-card-title>
          <ion-card-subtitle>Mon profil</ion-card-subtitle>
        </ion-card-header>

        <ion-card-content>
          <main>
            <span>Vous êtes connecté en tant que: {{ authService.tokenPayload()?.roles | json }}</span>

            <span>Credentials: {{ credentials | json }}</span>

            <div><ion-button (click)="login()" color="primary">Login</ion-button></div>
            <div><ion-button (click)="logout()" color="primary">Logout</ion-button></div>
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
export class ProfileComponent {
  authService = inject(AuthService);

  credentials = { username: 'pv_quentin', password: 'Soleil513' };

  constructor() {}

  login() {
    this.authService.login(this.credentials).subscribe(res => console.log(res));
  }

  logout() {
    this.authService.logout();
  }
}
