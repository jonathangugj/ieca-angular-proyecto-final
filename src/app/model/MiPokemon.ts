export class MiPokemon {
  id: number;
  name: string;
  base_experience: number;
  height: number;
  is_default: boolean;
  order: number;
  weight: number;

  constructor(id?:number,name?:string,base_experience?:number,height?:number,is_default?:boolean,order?:number,weight?:number){
    this.id=id??0;
    this.name=name??"";
    this.base_experience=base_experience??0;
    this.height=height??0;
    this.is_default=is_default??false;
    this.order=order??0;
    this.weight=weight??0;
  }
}