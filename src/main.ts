import { bootstrapApplication } from '@angular/platform-browser';
import { importProvidersFrom, provideZoneChangeDetection } from '@angular/core';
import { RouteReuseStrategy } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { IonicModule, IonicRouteStrategy } from '@ionic/angular/lazy';
import { IonicStorageModule } from '@ionic/storage-angular';
import { provideCharts, withDefaultRegisterables } from 'ng2-charts';

import { AppComponent } from './app/app.component';
import { AppRoutingModule } from './app/app-routing.module';
import { authInterceptor } from './app/core/interceptors/auth.interceptor';
import { errorInterceptor } from './app/core/interceptors/error.interceptor';
import { zoneInterceptor } from './app/core/interceptors/zone.interceptor';

bootstrapApplication(AppComponent, {
  providers: [
    importProvidersFrom(IonicModule.forRoot(), AppRoutingModule, IonicStorageModule.forRoot()),
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideHttpClient(withInterceptors([zoneInterceptor, authInterceptor, errorInterceptor])),
    provideCharts(withDefaultRegisterables()),
  ],
}).catch((err) => console.log(err));
