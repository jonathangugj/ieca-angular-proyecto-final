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

  agregaFavoritos(pokemon: MiPokemon) {
    this.logger.logVerbose(`[DetalleComponent] Agregando a favoritos a ${pokemon.name}`);
    this.servicio.addFavoritos(pokemon);
  }

  getMuestro(): boolean {
    if (this.padre===undefined) {
      return false;
    } else {
      if (this.padre==="busca"){
        return true;
      } else {
        if (this.pokemon === undefined)
          return false;
        else
          return this.servicio.esFavorito(this.pokemon);
      }
    }
  }

  getMuestraEnFavoritos():boolean{
    if (this.padre !== undefined)
      return this.padre==="favoritos";
    else 
      return false;
  }

  getMuestraEnBusca():boolean{
    if (this.padre !== undefined)
      return this.padre==="busca";
    else 
      return false;
  }

  public colorFavoritos():string{
    if (this.pokemon === undefined){
      return " ";
    }
    return this.servicio.esFavorito(this.pokemon)?"primary":"";
  }

  muestraModal(p: MiPokemon) {
    let respuesta:string="";
    const dialogRef = this.modal.open(
      ModalSiNoComponent,
      {data: {pokemon: p}},
    );
  }
  
}

