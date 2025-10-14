import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormBuilder, NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
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
  IonList,
  IonItem,
  IonInput,
  IonText,
} from '@ionic/angular/standalone';
import { AuthService, Credentials } from 'src/app/core/service/auth.service';

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
    ReactiveFormsModule,

    IonList,
    IonItem,
    IonText,
    IonInput,
    MatIconModule,
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
          <main class="ion-display-flex ion-flex-column">

            <ion-text>Role: {{ authService.tokenPayload()?.roles | json }}</ion-text>

            @if(authService.tokenPayload()) {
              <div>
                <ion-button (click)="logout()" color="primary"><mat-icon fontIcon="logout"></mat-icon> Logout</ion-button>
              </div>
            } @else {
              <form [formGroup]="formLogin" (submit)="login()">
                <ion-list>
                  <ion-item>
                    <ion-input labelPlacement="floating" formControlName="username">
                      <div slot="label">Email / Username</div>
                    </ion-input>
                  </ion-item>

                  <ion-item>
                    <ion-input labelPlacement="floating" type="password" formControlName="password">
                      <div slot="label">Mot de passe</div>
                    </ion-input>
                  </ion-item>
                </ion-list>

                <div class="ion-margin-top">
                  <ion-button type="submit" color="primary"><mat-icon fontIcon="login"></mat-icon> Login</ion-button>
                </div>
              </form>
            }

          </main>
        </ion-card-content>
      </ion-card>
    </ion-content>
  `,
  styles: ``,
})
export class ProfileComponent {
  formBuilder = inject(NonNullableFormBuilder);

  authService = inject(AuthService);

  formLogin = this.formBuilder.group({
    username: ['', [Validators.required]],
    password: ['', [Validators.required]],
  });

  constructor() {}

  login() {
    const credentials = this.formLogin.getRawValue() as Credentials;

    this.authService.login(credentials).subscribe(res => console.log(res));
  }

  logout() {
    this.authService.logout();
  }
}
