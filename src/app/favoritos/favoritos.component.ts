import { Component } from '@angular/core';
import { PokemonService } from '../pokemon.service';
import { MiPokemon } from '../model/MiPokemon';

@Component({
  selector: 'app-favoritos',
  templateUrl: './favoritos.component.html',
  styleUrl: './favoritos.component.scss'
})
export class FavoritosComponent {
  
  public favoritos: MiPokemon[]=[];
  
  constructor(private servicio: PokemonService ){

  }
  

  getFavoritos(){
    this.favoritos=this.servicio.getFavoritos();
  }

  ngOnInit(){
    this.getFavoritos();
  }

}
