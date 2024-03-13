import { Component } from '@angular/core';
import { LoggingService } from '../logging.service';
import { PokemonService } from '../pokemon.service';
import { MiPokemon } from '../model/MiPokemon';
import { Observable, of } from 'rxjs';
import { AppComponent } from '../app.component';

@Component({
  selector: 'app-buscar',
  templateUrl: './buscar.component.html',
  styleUrl: './buscar.component.scss'
})
export class BuscarComponent {
  
  public nombre:string="";
  public tipos?:Observable<string[]>;
  public grupos?:Observable<string[]>;
  public naturalezas?:Observable<string[]>;
  public habilidades?:Observable<string[]>;
  public habitats?:Observable<string[]>;

  public busquedaSelected:string="nombre";
  public buscar:string="buscar";
  public valorNombre:string="";
  public valorTipo:string="";
  public valorGrupo:string="";
  public valorNaturaleza:string="";
  public valorHabilidad:string="";
  public valorHabitat:string="";

  public tiposDeBusqueda:string[]=[
    "nombre",
    "tipo",
    "especie",
    //"naturaleza",
    "habilidad",
    "habitat"
  ];
  
  public despliegaResultado:boolean=false;
  public resultado:MiPokemon[]=[];

  constructor(
    private logger:LoggingService,
    private api: PokemonService
  ){

  }

  private async buscaPorNombre(nombre: string){
    let pokemon = await this.api.getMiPokemonPorNombre(nombre);
    this.resultado.push(pokemon);
  }

  private async consultaPrimeraGeneracion(tipo:string) {
    switch (tipo) {
      case "tipo":
        this.logger.logInfo(`[BuscarComponent][consultaPrimeraGeneracion] Buscando pokemones por tipo=[${this.valorTipo}]`);
        break;
      case "especie":
        this.logger.logInfo(`[BuscarComponent][consultaPrimeraGeneracion] Buscando pokemones por especie=[${this.valorGrupo}]`);
        break;
      case "naturaleza":
        this.logger.logInfo(`[BuscarComponent][consultaPrimeraGeneracion] Buscando pokemones por naturaleza=[${this.valorNaturaleza}]`);
        break;
      case "habilidad":
        this.logger.logInfo(`[BuscarComponent][consultaPrimeraGeneracion] Buscando pokemones por habilidad=[${this.valorHabilidad}]`);
        break;
      case "habitat":
        this.logger.logInfo(`[BuscarComponent][consultaPrimeraGeneracion] Buscando pokemones por habitat=[${this.valorHabitat}]`);
        break;
      default:

        break;
    }
    for (let index = 1; index <= AppComponent.LIMITE_POKEMONES; index++) {
      const pokemon = await this.api.getMiPokemonPorId(index);
      let resultado:boolean=false;
      //busqueda por tipo
      if (tipo==="tipo") {
        pokemon.types.forEach((elemento)=>{
          if (elemento.type.name.toUpperCase() === this.valorTipo.toUpperCase()){
            resultado=true;
          }
        });  
      } 
      //busqueda por especie
      if(tipo==="especie") {
        pokemon.especie?.egg_groups.forEach((elemento)=> {
          if (elemento.name.toUpperCase() === this.valorGrupo.toUpperCase())
            resultado=true;
        });
      }
      //busqueda por habilidad
      if(tipo==="habilidad"){
        pokemon.abilities.forEach((elemento)=>{
          if(elemento.ability.name.toUpperCase() == this.valorHabilidad.toUpperCase())
            resultado=true;
        });
      }

      //busqueda por habitat
      if(tipo==="habitat"){
        if (pokemon.especie?.habitat.name.toUpperCase() === this.valorHabitat.toUpperCase())
          resultado=true;
      }

      if (resultado) {
        this.logger.logInfo(`[BuscarComponent][consultaPrimeraGeneracion] Agregando a ${pokemon.name}`);
        this.resultado.push(pokemon);
      }
    }
  }

  public onBusqueda(tipo: string){
    if(this.resultado.length > 0){
      while(this.resultado.length > 0){
        this.resultado.pop();
      }
    }
    if (tipo === "nombre") {
      this.buscaPorNombre(this.valorNombre);
    } else {
      this.consultaPrimeraGeneracion(tipo);
    }
    this.despliegaResultado=true;
  }

  public getResultado() {
    const resultado = of(this.resultado);
    return resultado;
  }

  ngOnInit(){
    this.logger.logInfo(`[BuscarComponent][ngOnInit] Cargando catalogos`);
    this.api.cargaTipos();
    this.api.cargaGrupos();
    this.api.cargaNaturalezas();
    this.api.cargaHabilidades();
    this.api.cargaHabitats();
    this.tipos = this.api.getTipos();
    this.grupos = this.api.getGrupos();
    this.naturalezas = this.api.getNaturalezas();
    this.habilidades = this.api.getHabilidades();
    this.habitats = this.api.getHabitats();
    //al cargar la pagina se inicializa la bandera de mostrar resultado
    this.despliegaResultado = false;
  }

  
}
