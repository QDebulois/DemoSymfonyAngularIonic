import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonCard,
  IonCardHeader,
  IonCardSubtitle,
  IonList,
  IonItem,
  IonInput,
  IonIcon,
  IonLabel,
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { logIn, logOut } from 'ionicons/icons';
import { AuthService, Credentials } from 'src/app/core/service/auth.service';

@Component({
  selector: 'app-profile',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonCard,
    IonCardHeader,
    IonCardSubtitle,
    IonList,
    IonItem,
    IonInput,
    IonIcon,
    IonLabel,
  ],
  template: `
    <ion-header [translucent]="true">
      <ion-toolbar>
        <ion-title> Profil </ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content [fullscreen]="true" color="light" class="ion-padding">
      <ion-card>
        <ion-card-header>
          <ion-card-subtitle> Role: {{ authService.tokenPayload()?.roles | json }} </ion-card-subtitle>
        </ion-card-header>
      </ion-card>

      <ion-list [inset]="true">
        @if (authService.tokenPayload()) {
          <ion-item [button]="true" (click)="logout()">
            <ion-icon name="log-out"></ion-icon>
            <ion-label>Logout</ion-label>
          </ion-item>
        } @else {
          <form [formGroup]="formLogin">
            <ion-item [button]="true">
              <ion-input label="Email/Username" labelPlacement="floating" formControlName="username"></ion-input>
            </ion-item>
            <ion-item [button]="true">
              <ion-input label="Mot de passe" labelPlacement="floating" type="password" formControlName="password"></ion-input>
            </ion-item>
            <ion-item [button]="true" (click)="login()">
              <ion-icon name="log-in"></ion-icon>
              <ion-label>Login</ion-label>
            </ion-item>
          </form>
        }
      </ion-list>
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

  constructor() {
    addIcons({ logIn, logOut });
  }

  login() {
    const credentials = this.formLogin.getRawValue() as Credentials;

    this.authService.login(credentials).subscribe(res => console.log(res));
  }

  logout() {
    this.authService.logout();
  }
}
