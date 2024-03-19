import { NamedAPIResource, Pokemon, PokemonAbility, PokemonHeldItem, PokemonMove, PokemonPastType, PokemonSprites, PokemonStat, PokemonType, VersionGameIndex } from "pokenode-ts";
import { MiEspecie } from "./MiEspecie";
import { MiMovimiento } from "./MiMovimiento";

export class MiPokemon implements Pokemon {
  public habilidades:string[]=[];
  public movimientos?: MiMovimiento[];
  public especie?: MiEspecie;
  constructor(
    public id: number,
    public name: string,
    public base_experience: number,
    public height: number,
    public is_default: boolean,
    public order: number,
    public weight: number,
    public abilities: PokemonAbility[],
    public forms: NamedAPIResource[],
    public game_indices: VersionGameIndex[],
    public held_items: PokemonHeldItem[],
    public location_area_encounters: string,
    public moves: PokemonMove[],
    public sprites: PokemonSprites,
    public species: NamedAPIResource,
    public stats: PokemonStat[],
    public types: PokemonType[],
    public past_types: PokemonPastType[],
    public is_favorite: boolean) {
      this.abilities.forEach((element=>{
        this.habilidades.push(element.ability.name[0].toUpperCase() + element.ability.name.slice(1,element.ability.name.length));
      }));
  }

  getEspecie():string{
    let especie: string[]=[];
    this.especie?.egg_groups.forEach((e)=>{
      especie.push(e.name[0].toUpperCase() + e.name.slice(1,(e.name.length)));
    });
    return especie.join(",");
  }

  getDescripcion(): string{
    let descripcion: string ="";
    this.especie?.flavor_text_entries.forEach((e)=>{
      if(e.language.name==="en")
        descripcion=e.flavor_text;  
    });
    
    return descripcion;
  }
}