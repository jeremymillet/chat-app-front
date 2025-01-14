import { ApplicationConfig, provideZoneChangeDetection, importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';

import { registerLocaleData } from '@angular/common';
import fr from '@angular/common/locales/fr';
import { FormsModule } from '@angular/forms';
import { provideHttpClient } from '@angular/common/http';
import { provideNzI18n } from 'ng-zorro-antd/i18n';
import { provideNzIcons } from 'ng-zorro-antd/icon';
import { fr_FR } from 'ng-zorro-antd/i18n';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { icons } from './icons-provider';

registerLocaleData(fr);

export const appConfig: ApplicationConfig = {
  providers: [provideZoneChangeDetection({ eventCoalescing: true }), provideRouter(routes), provideNzIcons(icons), provideNzI18n(fr_FR), importProvidersFrom(FormsModule), provideAnimationsAsync(), provideHttpClient()]
};
