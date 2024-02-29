import { Injectable } from '@angular/core';
import { PokemonClient } from 'pokenode-ts';
import { MiPokemon } from './model/MiPokemon';

@Injectable({
  providedIn: 'root'
})

export class PokemonService {

  constructor() { }

  private static api = new PokemonClient();

  async getListaPokemon(inicio: number, cantidad:number): Promise<string[]>{
    let nombres: string[]=[];
    try{
      const data = await PokemonService.api.listPokemons(inicio,cantidad);
      data.results.forEach((element=>{
        nombres.push(element.name);
      }));
      return nombres;
    } catch (error){
      console.error(error);
    }
    return nombres;
  }

  async getMiPokemonPorNombre(nombre: string){
    let pokemon: MiPokemon;

    try{
      const data = await PokemonService.api.getPokemonByName(nombre);
      pokemon = new MiPokemon(data.id,data.name,data.base_experience,data.height,data.is_default,data.order,data.weight);
      console.log(pokemon);
      return pokemon;
    }catch (error){
      console.error(error);
    }
    return new MiPokemon();
  }

}
