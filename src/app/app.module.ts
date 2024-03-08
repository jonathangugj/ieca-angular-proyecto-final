import { APP_INITIALIZER, NgModule } from '@angular/core';
import { BrowserModule, provideClientHydration } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { NavbarComponent } from './navbar/navbar.component';

import { HomeComponent } from './home/home.component';
import { BuscaComponent } from './busca/busca.component';
import { FavoritosComponent } from './favoritos/favoritos.component';

import { MatGridListModule } from '@angular/material/grid-list';
import { DetalleComponent } from './detalle/detalle.component';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIcon } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatTabsModule } from '@angular/material/tabs';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { BuscarComponent } from './buscar/buscar.component';
import { MatTooltipModule } from '@angular/material/tooltip';
import { FooterComponent } from './footer/footer.component';
import { MatLabel } from '@angular/material/form-field';

import {
  MatDialogTitle,
  MatDialogContent,
  MatDialogActions,
  MatDialogClose,
} from '@angular/material/dialog';
import { ModalSiNoComponent } from './modal-si-no/modal-si-no.component';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { ConfiguracionService, LoggingLevel } from './configuracion.service';
import { catchError, map, of } from 'rxjs';

export function loadConfig(http: HttpClient, config: ConfiguracionService): (() => Promise<boolean>) {
  return (): Promise<boolean> => {
    console.log("[loadConfig] Cargando json de configuración");
    return new Promise<boolean>(resolve => {
      http.get('/assets/config.json')
        .pipe(
          map((c: any) => {
            config.loggingLevel = c.loggingLevel;
            resolve(true);
          }),
          catchError(() => {
            config.loggingLevel = LoggingLevel.None;
            resolve(true);
            return of({});
          })
        ).subscribe();
    });
  };
}

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    HomeComponent,
    BuscaComponent,
    FavoritosComponent,
    DetalleComponent,
    BuscarComponent,
    FooterComponent,
    ModalSiNoComponent,
  ],
  imports: [
    HttpClientModule,
    BrowserModule,
    AppRoutingModule,
    MatGridListModule,
    MatToolbarModule,
    MatIcon,
    MatCardModule,
    MatDividerModule,
    MatTabsModule,
    MatPaginatorModule,
    MatProgressBarModule,
    MatTooltipModule,
    MatDialogTitle,
    MatDialogContent,
    MatDialogActions,
    MatDialogClose,
    MatLabel
  ],
  providers: [
    provideClientHydration(),
    provideAnimationsAsync(),
    {
      provide: APP_INITIALIZER,
      useFactory: loadConfig,
      deps: [HttpClient, ConfiguracionService],
      multi: true,
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule { }
