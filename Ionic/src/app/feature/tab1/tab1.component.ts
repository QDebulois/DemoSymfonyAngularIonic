import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
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
  selector: 'app-tab1',
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
        <ion-title> Tab 1 </ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content [fullscreen]="true">
      <ion-card>
        <ion-card-header>
          <ion-card-title>Debug</ion-card-title>
          <ion-card-subtitle>Subtitle</ion-card-subtitle>
        </ion-card-header>

        <ion-card-content>
          <main>

            <span>Vous êtes connecté en tant que: {{ authService.tokenPayload()?.roles|json }}</span>

            <span>Credentials: {{ credentials|json }}</span>

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
export class Tab1Component {
  authService = inject(AuthService);
  httpClient = inject(HttpClient);

  credentials = { username: 'quentin@younivers.fr', password: 'Soleil513' };

  constructor() {}

  login() {
    this.authService.login(this.credentials).subscribe(res => console.log(res));
  }

  logout() {
    this.authService.logout();
  }
}
