import { Name, NamedAPIResource } from "pokenode-ts";

export class MiNombre implements Name {
    constructor(
        public name: string,
        public language: NamedAPIResource) {

    }
}