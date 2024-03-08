import { Component } from '@angular/core';
import { PokemonService } from '../pokemon.service';
import { MiPokemon } from '../model/MiPokemon';
import { LoggingService } from '../logging.service';

@Component({
  selector: 'app-favoritos',
  templateUrl: './favoritos.component.html',
  styleUrl: './favoritos.component.scss'
})
export class FavoritosComponent {
  
  public favoritos: MiPokemon[]=[];
  public padre:string="favoritos";
  
  constructor(
    private servicio: PokemonService,
    private logger: LoggingService
  ){

  }
  
  getFavoritos(){
    this.logger.logVerbose(`[FavoritosComponent] Consultando favoritos`);
    this.favoritos=this.servicio.getFavoritos();
  }

  ngOnInit(){
    this.getFavoritos();
  }

}
