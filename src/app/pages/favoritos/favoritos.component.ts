import { Component } from '@angular/core';
import { PokemonService } from '../../services/pokemon.service';
import { MiPokemon } from '../../model/classes/MiPokemon';

@Component({
  selector: 'app-favoritos',
  templateUrl: './favoritos.component.html',
  styleUrl: './favoritos.component.scss'
})
export class FavoritosComponent {
  
  public favoritos: MiPokemon[]=[];
  public padre:string="favoritos";
  
  constructor(
    private api: PokemonService,
  ){

  }
  
  getFavoritos(){
    this.favoritos=this.api.getFavoritos()
  }

  ngOnInit(){
    this.getFavoritos();
  }
}
