import { Injectable } from '@angular/core';
import { MoveClient, MoveTarget, PokemonAbility, PokemonClient, PokemonMove } from 'pokenode-ts';
import { MiPokemon } from './model/MiPokemon';
import { Utilidades } from './model/Utilidades';
import { MiEspecie } from './model/MiEspecie';
import { MiMovimiento } from './model/MiMovimiento';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class PokemonService {

  constructor() { }

  private static api = new PokemonClient();
  private static api_moves = new MoveClient();
  public movimientos: MiMovimiento[]=[];

  private favoritos: MiPokemon[]=[];

  addFavoritos(pokemon: MiPokemon){
    //Se valida si el elemento esta duplicado
    if (this.favoritos.length !== 0) {
      let miPokemon=this.favoritos.find((e)=> e.id === pokemon.id);
      if (miPokemon !== undefined) {
        //Se crea una nueva copia del arreglo sin el elemento seleccionado
        this.favoritos=this.favoritos.filter((e)=>{
          return e.id !== pokemon.id;
        });
      } else {
        this.favoritos.push(pokemon);
        console.log(pokemon);
      }
    } else {
      this.favoritos.push(pokemon);
      console.log(pokemon);
    }
  }

  getFavoritos(): MiPokemon[]{
    return this.favoritos;
  }

  esFavorito(pokemon:MiPokemon): boolean {
    let miPokemon=this.favoritos.find((e)=> e.id === pokemon.id);
    if (miPokemon !== undefined) {
      return true;
    }
    return false;  
  }

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

  async getTotalPokemones(): Promise<number> {
    try {
      let data = await PokemonService.api.listPokemons();
      return data.count;  
    } catch (error) {
      console.error(error);
    }
    return -1;
  }

  async getMiPokemonPorNombre(nombre: string): Promise<MiPokemon|null>{
    try{
      //Se consulta la información del pokemon
      const data = await PokemonService.api.getPokemonByName(nombre);
      const pokemon = new MiPokemon(
        data.id, data.name,data.base_experience, data.height,data.is_default,data.order,
        data.weight,data.abilities,data.forms,data.game_indices,data.held_items,
        data.location_area_encounters,data.moves,data.sprites,data.species,data.stats,
        data.types,data.past_types,false
      );
      //Se consulta la informacion de la especie del pokemon
      const dataSpecie = await PokemonService.api.getPokemonSpeciesByName(data.name);
      pokemon.especie=new MiEspecie(
        dataSpecie.id,dataSpecie.name,dataSpecie.order,dataSpecie.gender_rate,dataSpecie.capture_rate,
        dataSpecie.base_happiness,dataSpecie.is_baby,dataSpecie.is_legendary,dataSpecie.is_mythical,
        dataSpecie.hatch_counter,dataSpecie.has_gender_differences,dataSpecie.forms_switchable,
        dataSpecie.growth_rate,dataSpecie.pokedex_numbers,dataSpecie.egg_groups,dataSpecie.color,
        dataSpecie.shape,dataSpecie.evolves_from_species,dataSpecie.evolution_chain,dataSpecie.habitat,
        dataSpecie.generation,dataSpecie.names, dataSpecie.pal_park_encounters,dataSpecie.flavor_text_entries,
        dataSpecie.form_descriptions,dataSpecie.genera,dataSpecie.varieties);
      //Se consultan los movimientos
      let movimientos:MiMovimiento[]=[];
      data.moves.forEach(async (e) => {
        const movimiento = await PokemonService.api_moves.getMoveByName(e.move.name);
        movimientos.push(new MiMovimiento(
          movimiento.id, movimiento.name, movimiento.accuracy, movimiento.effect_chance,
          movimiento.pp, movimiento.priority, movimiento.power, movimiento.contest_combos,
          movimiento.contest_types, movimiento.contest_effect,movimiento.damage_class,
          movimiento.effect_entries,movimiento.effect_changes,movimiento.flavor_text_entries,
          movimiento.generation,movimiento.machines,movimiento.meta, movimiento.names,
          movimiento.past_values,movimiento.stat_changes,movimiento.super_contest_effect,
          movimiento.target, movimiento.type,movimiento.learned_by_pokemon));
      });
      pokemon.movimientos=movimientos;
      return pokemon;
    }catch (error){
      console.error(error);
    }
    return null;
  }

  async listaMovimientos(): Promise<MiMovimiento[]>{
    let movimientos: MiMovimiento[]=[];
    try {
      const data = await PokemonService.api_moves.listMoves();
      let numeroMovimientos = data.count;
      Utilidades.aLog(`Numero de movimientos x consultar:[${numeroMovimientos}]`);
      let contadorMovimientos: number = 0;
      let consultaTerminada:boolean=false;
      if (numeroMovimientos > 0){
        while(!consultaTerminada){
          const movs = await PokemonService.api_moves.listMoves(contadorMovimientos,50);
          movs.results.forEach(async (e)=>{
            const mov = await PokemonService.api_moves.getMoveByName(e.name);
            const movimiento = new MiMovimiento(
              mov.id,mov.name,mov.accuracy,mov.effect_chance,mov.pp,mov.priority,
              mov.power,mov.contest_combos,mov.contest_types,mov.contest_effect,
              mov.damage_class,mov.effect_entries,mov.effect_changes,mov.flavor_text_entries,
              mov.generation,mov.machines,mov.meta,mov.names,mov.past_values,
              mov.stat_changes,mov.super_contest_effect,mov.target,mov.type,mov.learned_by_pokemon
            );
            movimientos.push(movimiento);
            contadorMovimientos++;
          });
          //Utilidades.aLog(`Movimientos leidos: [${contadorMovimientos}]`);
          //this.sleep(500);
          if (contadorMovimientos === numeroMovimientos)consultaTerminada=true;
        }
      }
    } catch (error) {
      console.error(error);
    }
    return movimientos;
  }

  sleep(ms:number) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }  

  getMovimientos(): Observable<MiMovimiento[]>{
    this.listaMovimientos();
    const movs=of(this.movimientos);
    return movs;
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
