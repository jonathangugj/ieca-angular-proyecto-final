import { APIResource, Description, FlavorText, Genus, Name, NamedAPIResource, PalParkEncounterArea, PokemonSpecies, PokemonSpeciesDexEntry, PokemonSpeciesVariety } from "pokenode-ts"

export class MiEspecie implements PokemonSpecies {
    constructor (
    public id: number,
    public name: string,
    public order: number,
    public gender_rate: number,
    public capture_rate: number,
    public base_happiness: number,
    public is_baby: boolean,
    public is_legendary: boolean,
    public is_mythical: boolean,
    public hatch_counter: number,
    public has_gender_differences: boolean,
    public forms_switchable: boolean,
    public growth_rate: NamedAPIResource,
    public pokedex_numbers: PokemonSpeciesDexEntry[],
    public egg_groups: NamedAPIResource[],
    public color: NamedAPIResource,
    public shape: NamedAPIResource,
    public evolves_from_species: NamedAPIResource,
    public evolution_chain: APIResource,
    public habitat: NamedAPIResource,
    public generation: NamedAPIResource,
    public names: Name[],
    public pal_park_encounters: PalParkEncounterArea[],
    public flavor_text_entries: FlavorText[],
    public form_descriptions: Description[],
    public genera: Genus[],
    public varieties: PokemonSpeciesVariety[]) {

    }

}