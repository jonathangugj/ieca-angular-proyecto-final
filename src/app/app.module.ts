import { APP_INITIALIZER, NgModule } from '@angular/core';
import { BrowserModule, provideClientHydration } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { NavbarComponent } from './components/navbar/navbar.component';

import { HomeComponent } from './pages/home/home.component';
import { BuscaComponent } from './pages/busca/busca.component';
import { FavoritosComponent } from './pages/favoritos/favoritos.component';

import { MatGridListModule } from '@angular/material/grid-list';
import { DetalleComponent } from './components/detalle/detalle.component';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIcon } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatTabsModule } from '@angular/material/tabs';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { BuscarComponent } from './pages/buscar/buscar.component';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatFormField, MatHint, MatLabel } from '@angular/material/form-field';
import { 
  FormsModule, 
  FormControl, 
  FormGroupDirective,
  Validators,
  ReactiveFormsModule,

 } from '@angular/forms';
 import { MatInputModule } from '@angular/material/input';
 import { MatFormFieldModule } from "@angular/material/form-field";

import {
  MatDialogTitle,
  MatDialogContent,
  MatDialogActions,
  MatDialogClose,
} from '@angular/material/dialog';
import { ModalSiNoComponent } from './components/modal-si-no/modal-si-no.component';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { ConfiguracionService, LoggingLevel } from './services/configuracion.service';
import { catchError, map, of } from 'rxjs';
import { MatOption, MatSelect } from '@angular/material/select';
import { NgModel } from '@angular/forms';

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
    MatLabel,
    MatFormField,
    MatHint,
    MatSelect,
    MatOption,
    FormsModule,
    MatFormFieldModule,
    MatInputModule, ReactiveFormsModule
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
