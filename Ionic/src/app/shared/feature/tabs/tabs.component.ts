import { Component, EnvironmentInjector, inject } from '@angular/core';
import { IonTabs, IonTabBar, IonTabButton, IonIcon, IonLabel } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { triangle, ellipse, square } from 'ionicons/icons';

@Component({
  selector: 'app-tabs',
  imports: [IonTabs, IonTabBar, IonTabButton, IonIcon, IonLabel],
  template: `
    <ion-tabs>
      <ion-tab-bar slot="bottom">

        <ion-tab-button tab="tab1" href="/app/tab1">
          <ion-icon aria-hidden="true" name="triangle"></ion-icon>
          <ion-label>Tab 1</ion-label>
        </ion-tab-button>

        <ion-tab-button tab="tab2" href="/app/tab2">
          <ion-icon aria-hidden="true" name="ellipse"></ion-icon>
          <ion-label>Tab 2</ion-label>
        </ion-tab-button>

      </ion-tab-bar>
    </ion-tabs>
  `,
  styles: ``,
})
export class TabsComponent {
  public environmentInjector = inject(EnvironmentInjector);

  constructor() {
    addIcons({ triangle, ellipse, square });
  }
}
