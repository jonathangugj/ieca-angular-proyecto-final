export class MiPokemon {
  id: number;
  nombre: string;
  experiencia_base: number;
  altura: number;
  es_favorito: boolean;
  orden: number;
  peso: number;
  movimientos: Map<string, string>;
  habilidades: Map<string, string>;
  sprite: string;
  tipos: string[];

  constructor(id?: number, name?: string, base_experience?: number,
    height?: number, es_favorito?: boolean, order?: number, weight?: number,
    movimientos?: Map<string, string>, habilidades?: Map<string, string>,
    sprite?: string, tipos?: string[]) {
    this.id = id??0;
    this.nombre = name??"";
    this.experiencia_base = base_experience??0;
    this.altura = height??0;
    this.es_favorito = es_favorito??false;
    this.orden = order??0;
    this.peso = weight??0;
    this.movimientos=movimientos??new Map<string,string>();
    this.habilidades=habilidades??new Map<string,string>();
    this.sprite=sprite??"No disponible";
    this.tipos=tipos??[""];
  }
}