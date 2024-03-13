import { Injectable, ɵflushModuleScopingQueueAsMuchAsPossible } from '@angular/core';
import { MoveClient, PokemonClient} from 'pokenode-ts';
import { MiPokemon } from './model/MiPokemon';
import { MiEspecie } from './model/MiEspecie';
import { MiMovimiento } from './model/MiMovimiento';
import { LoggingService } from './logging.service';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { AppComponent } from './app.component';

@Injectable({
  providedIn: 'root'
})

export class PokemonService {
  constructor(
    private logger: LoggingService,
    private http: HttpClient
  ) { 

  }

  private static api = new PokemonClient();
  private static api_moves = new MoveClient();
  private favoritos: MiPokemon[]=[];
  private tipos:string[]=[];
  private grupos:string[]=[];
  private naturalezas:string[]=[];
  private habilidades:string[]=[];
  private habitats:string[]=[];
  private resultado:MiPokemon[]=[];

  public addFavoritos(pokemon: MiPokemon){
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
        pokemon.is_favorite=true;
        this.favoritos.push(pokemon);
        this.logger.logVerbose(`[PokemonService] Se agrega ${pokemon.name} a favoritos`, this.favoritos.length);
      }
    } else {
      this.favoritos.push(pokemon);
      pokemon.is_favorite=true;
      this.logger.logVerbose(`[PokemonService] Se agrega ${pokemon.name} a favoritos`, this.favoritos.length);
    }
  }

  public getFavoritos():MiPokemon[]{
    return this.favoritos;
  } 

  public esFavorito(pokemon:MiPokemon): boolean {
    let miPokemon=this.favoritos.find((e)=> e.id === pokemon.id);
    if (miPokemon !== undefined) {
      this.logger.logVerbose(`[PokemonService] ${pokemon} esta en favoritos`);
      return true;
    }
    this.logger.logVerbose(`[PokemonService] ${pokemon} NO esta en favoritos`);
    return false;  
  }

  public async getListaPokemon(inicio: number, cantidad:number): Promise<string[]>{
    this.logger.logInfo(`[PokemonService] Inicio getListaPokemon`);
    this.logger.logVerbose(`[PokemonService] Obteniendo [${cantidad}] pokemones, iniciando en ${inicio}`);
    let nombres: string[]=[];
    try{
      const data = await PokemonService.api.listPokemons(inicio,cantidad);
      data.results.forEach((element=>{
        nombres.push(element.name);
      }));
    } catch (error){
      this.logger.logError(`[PokemonService][getListaPokemon] ${error}`);
    }
    this.logger.logInfo(`[PokemonService] Fin getListaPokemon`);
    return nombres;
  }

  public async getMiPokemonPorNombre(nombre: string): Promise<MiPokemon>{
    this.logger.logInfo(`[PokemonService] Inicio getMiPokemonPorNombre (${nombre})`);
    let pokemon!:MiPokemon;
    try{
      //Se consulta la información del pokemon
      const data = await PokemonService.api.getPokemonByName(nombre);
      pokemon= new MiPokemon(
        data.id, data.name,data.base_experience, data.height,data.is_default,data.order,
        data.weight,data.abilities,data.forms,data.game_indices,data.held_items,
        data.location_area_encounters,data.moves,data.sprites,data.species,data.stats,
        data.types,data.past_types,false
      );
      if (pokemon !== undefined) {
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
        pokemon.is_favorite=this.esFavorito(pokemon);
      }
      this.logger.logVerbose(`[PokemonService] Fin getMiPokemonPorNombre (${nombre})`);
    }catch (error){
      this.logger.logError(`[PokemonService][getMiPokemonPorNombre] ${error}`);
    }
    this.logger.logVerbose(`[PokemonService] Fin getMiPokemonPorNombre (${nombre})`);
    return pokemon;
  }

  public async getMiPokemonPorId(id: number): Promise<MiPokemon>{
    this.logger.logVerbose(`[PokemonService] Inicio getMiPokemonPorId (${id})`);
    let pokemon!:MiPokemon;
    try{
      //Se consulta la información del pokemon
      const data = await PokemonService.api.getPokemonById(id);
      pokemon= new MiPokemon(
        data.id, data.name,data.base_experience, data.height,data.is_default,data.order,
        data.weight,data.abilities,data.forms,data.game_indices,data.held_items,
        data.location_area_encounters,data.moves,data.sprites,data.species,data.stats,
        data.types,data.past_types,false
      );
      if (pokemon !== undefined) {
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
        pokemon.is_favorite=this.esFavorito(pokemon);
      }
    }catch (error){
      this.logger.logError(`[PokemonService][getMiPokemonPorNombre] ${error}`);
    }
    this.logger.logVerbose(`[PokemonService] Fin getMiPokemonPorNombre (${id})`);
    return pokemon;
  }

  public async cargaTipos() {
    this.logger.logInfo(`[PokemonService] Inicio carga asincrona de tipos de pokemones`);
    if(this.tipos.length > 0){
      this.logger.logInfo(`[PokemonService] Catalogo de tipos cargados`);
      return;
    }
    try {
      let data = await PokemonService.api.listTypes();
      data.results.forEach((element) => {
        this.tipos.push(element.name)
      });
    } catch (error) {
      this.logger.logError(`[PokemonService][cargaTipos] ${error}`);
    }
    this.logger.logInfo(`[PokemonService] Fin carga asincrona de tipos de pokemones`);
  }

  public getTipos(): Observable<string[]>{
     const tipos = of(this.tipos);
     return tipos;
  }

  public async cargaGrupos() {
    this.logger.logInfo(`[PokemonService] Inicio carga asincrona de grupos de pokemones`);
    try {
      let data = await PokemonService.api.listEggGroups();
      data.results.forEach((element) => {
        this.grupos.push(element.name);
      });
    } catch (error) {
      this.logger.logError(`[PokemonService][cargaGrupos] ${error}`);
    }
    this.logger.logInfo(`[PokemonService] Fin carga asincrona de grupos de pokemones`);
  }

  public getGrupos(): Observable<string[]>{
    const grupos=of(this.grupos);
    return grupos;
  }

  public async cargaNaturalezas() {
    this.logger.logInfo(`[PokemonService] Inicio carga asincrona de naturaleza de pokemones`);
    try {
      let data = await PokemonService.api.listNatures();
      data.results.forEach((element) => {
        this.naturalezas.push(element.name);
      });
    } catch (error) {
      this.logger.logError(`[PokemonService][cargaNaturalezas] ${error}`);
    }
    this.logger.logInfo(`[PokemonService] Inicio carga asincrona de naturaleza de pokemones`);
  }

  public getNaturalezas(): Observable<string[]>{
    const naturalezas=of(this.naturalezas);
    return naturalezas;
  }

  public async cargaHabilidades(){
    this.logger.logInfo(`[PokemonService] Inicio carga asincrona de habilidades de pokemones`);
    try {
      let data = await PokemonService.api.listAbilities();
      data.results.forEach((element) => {
        this.habilidades.push(element.name);
      });
    } catch (error) {
      this.logger.logError(`[PokemonService][cargaHabilidades] ${error}`);
    }
    this.logger.logInfo(`[PokemonService] Inicio carga asincrona de habilidades de pokemones`);
  }  

  public getHabilidades():Observable<string[]>{
    const habilidades=of(this.habilidades);
    return habilidades;
  }

  public async cargaHabitats() {
    this.logger.logInfo(`[PokemonService] Inicio carga asincrona de habitats de pokemones`);
    try {
      let data = await PokemonService.api.listPokemonHabitats();
      data.results.forEach((element) => {
        this.habitats.push(element.name);
      });
    } catch (error) {
      this.logger.logError(`[PokemonService][cargaHabitats] ${error}`);
    }
    this.logger.logInfo(`[PokemonService] Fin carga asincrona de habitats de pokemones`);
  }

  public getHabitats():Observable<string[]>{
    const habitats=of(this.habitats);
    return habitats;
  }
}
