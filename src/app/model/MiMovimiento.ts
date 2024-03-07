import { APIResource, AbilityEffectChange, ContestComboSets, MachineVersionDetail, Move, MoveFlavorText, MoveMetaData, MoveStatChange, Name, NamedAPIResource, PastMoveStatValues, VerboseEffect } from "pokenode-ts";



export class MiMovimiento implements Move {
    constructor (
    public id: number,
    public name: string,
    public accuracy: number | null,
    public effect_chance: number | null,
    public pp: number | null,
    public priority: 0 | 4 | 1 | 8 | 2 | 6 | 3 | -1 | -8 | 7 | -7 | -6 | 5 | -5 | -4 | -3 | -2,
    public power: number | null,
    public contest_combos: ContestComboSets | null,
    public contest_types: NamedAPIResource | null,
    public contest_effect: APIResource | null,
    public damage_class: NamedAPIResource | null,
    public effect_entries: VerboseEffect[],
    public effect_changes: AbilityEffectChange[],
    public flavor_text_entries: MoveFlavorText[],
    public generation: NamedAPIResource,
    public machines: MachineVersionDetail[],
    public meta: MoveMetaData | null,
    public names: Name[],
    public past_values: PastMoveStatValues[],
    public stat_changes: MoveStatChange[],
    public super_contest_effect: APIResource | null,
    public target: NamedAPIResource,
    public type: NamedAPIResource,
    public learned_by_pokemon: NamedAPIResource[]) {

    }

    public getNombre():string {
        let nombre = this.names.find((e)=> e.language.name === "en");
        if (nombre === undefined){
            return this.name;
        } 
        return nombre.name;
    }

    public getDescripcion():string{
        let descripcion=this.flavor_text_entries.find((e)=> e.language.name === "en");
        if (descripcion === undefined){
            return "Sin información";
        }
        return descripcion.flavor_text;
    }

    public getTipo(): string {
        return this.type.name;
    }

}