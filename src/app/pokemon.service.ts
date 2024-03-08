import { Injectable } from '@angular/core';
import { MoveClient, MoveTarget, PokemonAbility, PokemonClient, PokemonMove } from 'pokenode-ts';
import { MiPokemon } from './model/MiPokemon';
import { Utilidades } from './model/Utilidades';
import { MiEspecie } from './model/MiEspecie';
import { MiMovimiento } from './model/MiMovimiento';
import { Observable, of } from 'rxjs';
import { LoggingService } from './logging.service';

@Injectable({
  providedIn: 'root'
})

export class PokemonService {

  constructor(private logger: LoggingService) { }

  private static api = new PokemonClient();
  private static api_moves = new MoveClient();
  public movimientos: MiMovimiento[]=[];

  private favoritos: MiPokemon[]=[];

  addFavoritos(pokemon: MiPokemon){
    this.logger.logVerbose("[PokemonService] Entrando a addFavoritos");
    //Se valida si el elemento esta duplicado
    if (this.favoritos.length !== 0) {
      let miPokemon=this.favoritos.find((e)=> e.id === pokemon.id);
      if (miPokemon !== undefined) {
        this.logger.logVerbose(`[PokemonService] Elemento ${pokemon.name} en favoritos, se removera`);
        this.favoritos=this.favoritos.filter((e)=>{
          return e.id !== pokemon.id;
        });
      } else {
        this.favoritos.push(pokemon);
        this.logger.logVerbose(`[PokemonService] Se agrega ${pokemon.name} a favoritos`, this.favoritos.length);
      }
    } else {
      this.favoritos.push(pokemon);
      this.logger.logVerbose(`[PokemonService] Se agrega ${pokemon.name} a favoritos`, this.favoritos.length);
    }
  }

  getFavoritos(): MiPokemon[]{
    this.logger.logVerbose(`[PokemonService] Numero de pokemones en favoritos [${this.favoritos.length}]`);
    return this.favoritos;
  }

  esFavorito(pokemon:MiPokemon): boolean {
    let miPokemon=this.favoritos.find((e)=> e.id === pokemon.id);
    if (miPokemon !== undefined) {
      this.logger.logVerbose(`[PokemonService] ${pokemon} esta en favoritos`);
      return true;
    }
    this.logger.logVerbose(`[PokemonService] ${pokemon} NO esta en favoritos`);
    return false;  
  }

  async getListaPokemon(inicio: number, cantidad:number): Promise<string[]>{
    this.logger.logVerbose(`[PokemonService] Inicio getListaPokemon`);
    this.logger.logVerbose(`[PokemonService] Obteniendo [${cantidad}] pokemones, iniciando en ${inicio}`);
    let nombres: string[]=[];
    try{
      const data = await PokemonService.api.listPokemons(inicio,cantidad);
      data.results.forEach((element=>{
        nombres.push(element.name);
      }));
      this.logger.logVerbose(`[PokemonService] Fin getListaPokemon`);
      return nombres;
    } catch (error){
      this.logger.logError(error);
    }
    this.logger.logVerbose(`[PokemonService] Fin getListaPokemon`);
    return nombres;
  }

  async getMiPokemonPorNombre(nombre: string): Promise<MiPokemon|null>{
    this.logger.logVerbose(`[PokemonService] Inicio getMiPokemonPorNombre (${nombre})`);

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
      this.logger.logVerbose(`[PokemonService] Fin getMiPokemonPorNombre (${nombre})`);
      return pokemon;
    }catch (error){
      this.logger.logError(error);
    }
    this.logger.logVerbose(`[PokemonService] Fin getMiPokemonPorNombre (${nombre})`);
    return null;
  }
}
