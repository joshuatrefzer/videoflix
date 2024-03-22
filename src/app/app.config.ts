import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideClientHydration } from '@angular/platform-browser';
import { HttpClient, provideHttpClient, withFetch, withInterceptors } from '@angular/common/http';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { loggerInterceptor } from './logger.interceptor';
import { AuthInterceptorService } from './services/auth-interceptor.service';
import { errorInterceptor } from './error.interceptor';
import { cachingInterceptor } from './caching.interceptor';

export const appConfig: ApplicationConfig = {
  providers: [provideRouter(routes), provideClientHydration(), provideHttpClient(withFetch() , withInterceptors([
    loggerInterceptor, errorInterceptor
  ])), provideAnimationsAsync()]
};
