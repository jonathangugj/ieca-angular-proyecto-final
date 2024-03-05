import { APIResource, MoveStatAffectSets, Name, NamedAPIResource, NatureStatAffectSets, Stat } from "pokenode-ts";

export class MiAtributo implements Stat {
    constructor (
    public id: number,
    public name: "hp" | "attack" | "defense" | "special-attack" | "special-defense" | "speed" | "accuracy" | "evasion",
    public game_index: number,
    public is_battle_only: boolean,
    public affecting_moves: MoveStatAffectSets,
    public affecting_natures: NatureStatAffectSets,
    public characteristics: APIResource[],
    public move_damage_class: NamedAPIResource | null,
    public names: Name[]){

    }
    
}