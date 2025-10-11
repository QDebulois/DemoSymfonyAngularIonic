import { bootstrapApplication } from '@angular/platform-browser';
import { RouteReuseStrategy, provideRouter, withPreloading, PreloadAllModules } from '@angular/router';
import { IonicRouteStrategy, provideIonicAngular } from '@ionic/angular/standalone';

import { routes } from './app/app.routes';
import { AppComponent } from './app/app.component';

import { provideHttpClient, withFetch, withInterceptors } from '@angular/common/http' ;
import { apiAuthInterceptor } from './app/core/interceptor/api-auth.interceptor';
import { apiDateAtomInterceptor } from './app/core/interceptor/date-atom.interceptor';

bootstrapApplication(AppComponent, {
  providers: [
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    provideIonicAngular(),
    provideRouter(routes, withPreloading(PreloadAllModules)),
    provideHttpClient(withFetch(), withInterceptors([apiAuthInterceptor, apiDateAtomInterceptor])),
  ],
});
