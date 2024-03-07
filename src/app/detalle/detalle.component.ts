import { Component, Input } from '@angular/core';
import { MiPokemon } from '../model/MiPokemon';
import { PokemonService } from '../pokemon.service';
import { MiMovimiento } from '../model/MiMovimiento';

@Component({
  selector: 'app-detalle',
  templateUrl: './detalle.component.html',
  styleUrl: './detalle.component.scss'
})
export class DetalleComponent {

  constructor(private servicio: PokemonService ){

  }

  @Input() pokemon?: MiPokemon;

  agregaFavoritos(pokemon: MiPokemon) {
    this.servicio.addFavoritos(pokemon);
  }

  public colorFavoritos():string{
    if (this.pokemon === undefined){
      return " ";
    }
    return this.servicio.esFavorito(this.pokemon)?"primary":"";
  }
  
}
