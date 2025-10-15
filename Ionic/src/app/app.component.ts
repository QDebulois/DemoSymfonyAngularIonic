import { Component, inject } from '@angular/core';
import { IonApp, IonRouterOutlet, IonToast } from '@ionic/angular/standalone';
import { ToastService } from './shared/service/toast.service';

@Component({
  selector: 'app-root',
  imports: [IonApp, IonRouterOutlet, IonToast],
  template: `
    <ion-app>
      <ion-router-outlet></ion-router-outlet>
      <ion-toast
        [isOpen]="toastService.toastIsOpen()"
        [message]="toastService.toastMessage()"
        [duration]="toastService.toastDuration()"
        (didDismiss)="toastService.setOpen(false)"
        [positionAnchor]="'tab-bar'"
      ></ion-toast>
    </ion-app>
  `,
  styles: ``,
})
export class AppComponent {
  toastService = inject(ToastService);

  constructor() {}
}
