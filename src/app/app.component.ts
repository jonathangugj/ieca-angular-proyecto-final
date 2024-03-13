import { Component } from '@angular/core';
import { MiMovimiento } from './model/MiMovimiento';
import { PokemonService } from './pokemon.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'diccionario-pokemon';
  public static LIMITE_POKEMONES=151;

}
