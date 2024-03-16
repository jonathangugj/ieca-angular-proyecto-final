import { Component, Inject, Input } from '@angular/core';
import { MiPokemon } from '../model/MiPokemon';
import { PokemonService } from '../pokemon.service';
import { ModalSiNoComponent } from '../modal-si-no/modal-si-no.component';
import { MatDialog } from '@angular/material/dialog';
import { LoggingService } from '../logging.service';

@Component({
  selector: 'app-detalle',
  templateUrl: './detalle.component.html',
  styleUrl: './detalle.component.scss',
})
export class DetalleComponent {

  constructor(private servicio: PokemonService,
              private modal: MatDialog,
              private logger: LoggingService ){

  }

  @Input() pokemon?: MiPokemon;
  @Input() padre?: string;

  public agregaFavoritos() {
    if (this.pokemon !== undefined) {
      this.logger.logVerbose(`[DetalleComponent] Agregando a favoritos a ${this.pokemon.name}`);
      this.servicio.addFavoritos(this.pokemon);
    }
  }

  public getMuestro(): boolean {
    if (this.padre===undefined) {
      return false;
    } else {
      if (this.padre==="busca" || this.padre === "buscar"){
        return true;
      } else {
        if (this.pokemon === undefined)
          return false;
        else
          return this.pokemon.is_favorite;
      }
    }
  }

  public getMuestraEnFavoritos():boolean{
    if (this.padre !== undefined)
      return this.padre==="favoritos";
    else 
      return false;
  }

  public getMuestraEnBusca():boolean{
    if (this.padre !== undefined)
      return this.padre==="busca" || this.padre === "buscar";
    else 
      return false;
  }

  public colorFavoritos():string{
    if (this.pokemon === undefined){
      return " ";
    }
      return this.pokemon.is_favorite?"primary":"";
  }

  public getTipoDefault():string {
    let tipo:string="";
    if (this.pokemon !== undefined) {
      this.pokemon.types.forEach((element)=>{
        if(tipo === "")
          tipo = element.type.name;
      });
    }
    return tipo;
  }

  public muestraModal() {
    let respuesta:string="";
    const dialogRef = this.modal.open(
      ModalSiNoComponent,
      {data: {nombre: this.pokemon?.name, pokemon: this.pokemon}},
    );

    dialogRef.afterClosed().subscribe(result=>{
      this.logger.logVerbose(`[DetalleComponent] resultado modal=[${result}]`);
      if (result && this.pokemon !== undefined){
        this.pokemon.is_favorite=false;
        this.servicio.addFavoritos(this.pokemon);
      }
    });
  }
  
}

