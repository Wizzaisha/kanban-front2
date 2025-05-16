import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideClientHydration } from '@angular/platform-browser';
import { providePrimeNG } from 'primeng/config';
import StylePreset from './shared/style-presets/style-preset';
import { provideStore } from '@ngrx/store';
import { provideEffects } from '@ngrx/effects';
import { provideAnimations } from '@angular/platform-browser/animations';
import {
  provideHttpClient,
  withFetch,
  withInterceptors,
} from '@angular/common/http';
import { reducers } from './shared/store/app.reducer';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideStoreDevtools } from '@ngrx/store-devtools';
import { environment } from '../environments/environment.development';
import { metaReducers } from './shared/store/meta-reducers';
import { LandingEffects } from './pages/landing-page/store/landing.effects';
import { apiUrlInterceptor } from './shared/interceptors/api-url.interceptor';
import {
  DialogService,
  DynamicDialogRef,
  DynamicDialogConfig,
} from 'primeng/dynamicdialog';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideClientHydration(),
    provideStore(reducers, {
      metaReducers: metaReducers,
    }),
    provideAnimations(),
    provideAnimationsAsync(),
    providePrimeNG({
      theme: {
        preset: StylePreset,
        options: {
          darkModeSelector: '.my-app-dark',
        },
      },
    }),
    provideEffects([LandingEffects]),
    provideHttpClient(withFetch(), withInterceptors([apiUrlInterceptor])),
    provideStoreDevtools({
      maxAge: 25,
      logOnly: !environment.production,
      autoPause: true,
    }),
    DialogService,
    DynamicDialogRef,
    DynamicDialogConfig,
  ],
};
