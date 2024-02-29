import { Injectable } from '@angular/core';
import { MoveClient, MoveTarget, PokemonAbility, PokemonClient, PokemonMove } from 'pokenode-ts';
import { MiPokemon } from './model/MiPokemon';

@Injectable({
  providedIn: 'root'
})

export class PokemonService {

  constructor() { }

  private static api = new PokemonClient();
  private static api_moves = new MoveClient();

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
    let habilidades = new Map<string,string>();
    let movimientos = new Map<string,string>();
    let sprite: string ="";
    let tipos:string[]=[];
    try{
      const data = await PokemonService.api.getPokemonByName(nombre);
      //Se obtienen las habilidades
      data.abilities.forEach(async (element) => {
        await this.buscaHabilidad(element, habilidades);
      });
      //Se obtienen los movimientos
      data.moves.forEach(async(element)=>{
        await this.buscaMovimiento(element.move.name,movimientos);
      });
      sprite=data.sprites.front_default??"TODO";
      data.types.forEach((element)=>{
        tipos.push(element.type.name);
      });
      const pokemon = new MiPokemon(data.id,data.name,data.base_experience,
        data.height,false,data.order,data.weight, movimientos,habilidades,
        sprite, tipos);
      console.log(pokemon);
      return pokemon;
    }catch (error){
      console.error(error);
    }
    return new MiPokemon();
  }

  async buscaMovimiento(movimiento: string, movimientos: Map<string,string>){
    try {
      const data = await PokemonService.api_moves.getMoveByName(movimiento);
      //Se obtiene la descripcion de la habilidad de acuerdo al idioma "es"
      let descripciones=data.flavor_text_entries;
      let descripcion: string = "";
      descripciones.find((element)=>{
        if (element.language.name==="es") {
          descripcion = element.flavor_text;
        }
      });
      movimientos.set(movimiento, descripcion);
    } catch (error) {
      console.error(error);
    }
  }

  async buscaHabilidad(habilidad: PokemonAbility, habilidades: Map<string, string>) {
    try {
      const data = await PokemonService.api.getAbilityByName(habilidad.ability.name);
      //Se obtiene la descripcion de la habilidad de acuerdo al idioma "es"
      let descripciones=data.flavor_text_entries;
      let descripcion: string = "";
      descripciones.find((element)=>{
        if (element.language.name==="es") {
          descripcion = element.flavor_text;
        }
      });
      //Se obtiene el nombre de la habilidad
      let nombres=data.names;
      let nombre: string = "";
      nombres.find((element)=>{
        if(element.language.name==="es"){
          nombre=element.name;
        }
      });
      habilidades.set(nombre, descripcion);
    } catch (error) {
      console.error(error);
    }
  }
}
