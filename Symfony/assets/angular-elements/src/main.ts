import { createApplication } from '@angular/platform-browser';
import { createCustomElement } from '@angular/elements';
import { provideHttpClient, withFetch } from '@angular/common/http';

import { TestComponent } from './feature/test/test.component';

createApplication({
  providers: [provideHttpClient(withFetch())],
})
  .then(app => {
    customElements.define('app-test', createCustomElement(TestComponent, { injector: app.injector }));
  })
  .catch(err => console.error(err));

