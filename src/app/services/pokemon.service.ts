import { Injectable} from '@angular/core';
import { PokemonClient} from 'pokenode-ts';
import { MiPokemon } from '../model/classes/MiPokemon';
import { MiEspecie } from '../model/classes/MiEspecie';
import { LoggingService } from './logging.service';
import { Observable, Subject, of } from 'rxjs';
import { DatabaseService, Favoritos } from './database.service';

@Injectable({
  providedIn: 'root'
})

export class PokemonService {
  constructor(
    private logger: LoggingService,
    private dbService: DatabaseService
  ) { 

  }

  private static api = new PokemonClient();
  private favoritos: MiPokemon[]=[];
  private favoritosDB: MiPokemon[]=[];
  private tipos:string[]=[];
  private grupos:string[]=[];
  private naturalezas:string[]=[];
  private habilidades:string[]=[];
  private habitats:string[]=[];
  private resultado:MiPokemon[]=[];

  public addFavoritos(pokemon: MiPokemon){
    this.logger.logInfo("[PokemonService][addFavoritos] Inicio");
    //Se valida si el elemento esta duplicado
    if (this.favoritos.length !== 0) {
      let miPokemon=this.favoritos.find((e)=> e.id === pokemon.id);
      if (miPokemon !== undefined) {
        this.logger.logVerbose(`[PokemonService][addFavoritos] Elemento ${pokemon.name} en favoritos, se removera`);
        this.favoritos=this.favoritos.filter((e)=>{
          return e.id !== pokemon.id;
        });
      } else {
        pokemon.is_favorite=true;
        this.favoritos.push(pokemon);
        this.logger.logVerbose(`[PokemonService][addFavoritos] Se agrega ${pokemon.name} a favoritos`, this.favoritos.length);
      }
    } else {
      this.favoritos.push(pokemon);
      pokemon.is_favorite=true;
      this.logger.logVerbose(`[PokemonService][addFavoritos] Se agrega ${pokemon.name} a favoritos`, this.favoritos.length);
    }
    this.logger.logInfo("[PokemonService][addFavoritos] Fin");
  }

  public getFavoritos():MiPokemon[]{
    return this.favoritos;
  } 

  public getFavoritosDB():Observable<MiPokemon[]>{
    this.logger.logInfo(`[PokemonService][getFavoritosDB] Inicio`);
    const favoritos = of(this.favoritosDB);
    this.logger.logInfo(`[PokemonService][getFavoritosDB] Fin`);
    return favoritos;
  } 

  public async addFavoritoDb(favorito:Favoritos){
    this.logger.logInfo(`[PokemonService][addFavoritoDb] Inicio`, this.favoritosDB.length);
    const pokemon = await this.getMiPokemonPorNombre(favorito.name);
    this.favoritosDB.push(pokemon);
    this.logger.logInfo(`[PokemonService][addFavoritoDb] Fin`, this.favoritosDB.length);
  }

  public esFavorito(pokemon:MiPokemon): boolean {
    let miPokemon=this.favoritos.find((e)=> e.id === pokemon.id);
    if (miPokemon !== undefined) {
      this.logger.logVerbose(`[PokemonService][esFavorito] ${pokemon} esta en favoritos`);
      return true;
    }
    this.logger.logVerbose(`[PokemonService][esFavorito] ${pokemon} NO esta en favoritos`);
    return false;  
  }

  public async getListaPokemon(inicio: number, cantidad:number): Promise<string[]>{
    this.logger.logInfo(`[PokemonService][getListaPokemon] Inicio`);
    this.logger.logVerbose(`[PokemonService] Obteniendo [${cantidad}] pokemones, iniciando en ${inicio}`);
    let nombres: string[]=[];
    try{
      const data = await PokemonService.api.listPokemons(inicio,cantidad);
      data.results.forEach((element=>{
        nombres.push(element.name);
      }));
    } catch (error){
      this.logger.logError(`[PokemonService][getListaPokemon] ${error}`);
      throw Error('Intenta mas tarde');
    }
    this.logger.logInfo(`[PokemonService][getListaPokemon] Fin`);
    return nombres;
  }

  public async getMiPokemonPorNombre(nombre: string): Promise<MiPokemon>{
    this.logger.logInfo(`[PokemonService][getMiPokemonPorNombre] Inicio (${nombre})`);
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
      this.logger.logVerbose(`[PokemonService][getMiPokemonPorNombre] Fin`);
    }catch (error){
      this.logger.logError(`[PokemonService][getMiPokemonPorNombre] ${error}`);
      throw Error('Intenta mas tarde');
    }
    this.logger.logVerbose(`[PokemonService][getMiPokemonPorNombre] Fin`);
    return pokemon;
  }

  public async getMiPokemonPorId(id: number): Promise<MiPokemon>{
    this.logger.logInfo(`[PokemonService][getMiPokemonPorId] Inicio (${id})`);
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
      throw Error('Intenta mas tarde');
    }
    this.logger.logVerbose(`[PokemonService][getMiPokemonPorId] Fin (${id})`);
    return pokemon;
  }

  public async cargaTipos() {
    this.logger.logInfo(`[PokemonService][cargaTipos] Inicio`);
    if(this.tipos.length > 0){
      this.logger.logInfo(`[PokemonService][cargaTipos] Catalogo de tipos cargado`);
      return;
    }
    try {
      let data = await PokemonService.api.listTypes();
      data.results.forEach((element) => {
        this.tipos.push(element.name)
      });
    } catch (error) {
      this.logger.logError(`[PokemonService][cargaTipos] ${error}`);
      throw Error('Intenta mas tarde');
    }
    this.logger.logInfo(`[PokemonService][cargaTipos] Fin`);
  }

  public getTipos(): Observable<string[]>{
     const tipos = of(this.tipos);
     return tipos;
  }

  public async cargaGrupos() {
    this.logger.logInfo(`[PokemonService][cargaGrupos] Inicio`);
    if(this.grupos.length > 0){
      this.logger.logInfo(`[PokemonService][cargaGrupos] Catalogo de grupos cargado`);
      return;
    }
    try {
      let data = await PokemonService.api.listEggGroups();
      data.results.forEach((element) => {
        this.grupos.push(element.name);
      });
    } catch (error) {
      this.logger.logError(`[PokemonService][cargaGrupos] ${error}`);
      throw Error('Intenta mas tarde');
    }
    this.logger.logInfo(`[PokemonService][cargaGrupos] Fin`);
  }

  public getGrupos(): Observable<string[]>{
    const grupos=of(this.grupos);
    return grupos;
  }

  public async cargaNaturalezas() {
    this.logger.logInfo(`[PokemonService][cargaNaturalezas] Inicio`);
    if(this.naturalezas.length > 0){
      this.logger.logInfo(`[PokemonService][cargaNaturalezas] Catalogo de naturalezas cargado`);
      return;
    }
    try {
      let data = await PokemonService.api.listNatures();
      data.results.forEach((element) => {
        this.naturalezas.push(element.name);
      });
    } catch (error) {
      this.logger.logError(`[PokemonService][cargaNaturalezas] ${error}`);
      throw Error('Intenta mas tarde');
    }
    this.logger.logInfo(`[PokemonService][cargaNaturalezas] Inicio carga asincrona de naturaleza de pokemones`);
  }

  public getNaturalezas(): Observable<string[]>{
    const naturalezas=of(this.naturalezas);
    return naturalezas;
  }

  public async cargaHabilidades(){
    this.logger.logInfo(`[PokemonService][cargaHabilidades] Inicio`);
    if(this.habilidades.length > 0){
      this.logger.logInfo(`[PokemonService][cargaHabilidades] Catalogo de naturalezas cargado`);
      return;
    }
    try {
      let data = await PokemonService.api.listAbilities();
      data.results.forEach((element) => {
        this.habilidades.push(element.name);
      });
    } catch (error) {
      this.logger.logError(`[PokemonService][cargaHabilidades] ${error}`);
      throw Error('Intenta mas tarde');
    }
    this.logger.logInfo(`[PokemonService] Fin`);
  }  

  public getHabilidades():Observable<string[]>{
    const habilidades=of(this.habilidades);
    return habilidades;
  }

  public async cargaHabitats() {
    this.logger.logInfo(`[PokemonService][cargaHabitats] Inicio`);
    if(this.habitats.length > 0){
      this.logger.logInfo(`[PokemonService][cargaHabilidades] Catalogo de habitats cargado`);
      return;
    }
    try {
      let data = await PokemonService.api.listPokemonHabitats();
      data.results.forEach((element) => {
        this.habitats.push(element.name);
      });
    } catch (error) {
      this.logger.logError(`[PokemonService][cargaHabitats] ${error}`);
      throw Error('Intenta mas tarde');
    }
    this.logger.logInfo(`[PokemonService][cargaHabitats] Fin`);
  }

  public getHabitats():Observable<string[]>{
    const habitats=of(this.habitats);
    return habitats;
  }
}
