import { Component } from '@angular/core';
import { MiPokemon } from '../model/MiPokemon';
import { PokemonService } from '../pokemon.service';

@Component({
  selector: 'app-busca',
  templateUrl: './busca.component.html',
  styleUrl: './busca.component.scss'
})
export class BuscaComponent {

  constructor(private pokeService: PokemonService){}

  /** Listas de pokemones */
  pokemones: MiPokemon[]=[];
  favoritos: MiPokemon[]=[];

  async consultaGenericaInicial(){
    let nombres = await this.pokeService.getListaPokemon(0,20);
    this.pokemones=[];
    if (nombres.length != 0) {
      try {
        nombres.forEach(async (element) => {
          const pokemon = await this.pokeService.getMiPokemonPorNombre(element);
          this.pokemones.push(pokemon);
        });   
      } catch (error) {
        console.error(error);
      }
    }
  }

  ngOnInit(){
    this.consultaGenericaInicial();
  }

}
