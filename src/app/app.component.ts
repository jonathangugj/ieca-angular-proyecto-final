import { Component } from '@angular/core';
import { MiMovimiento } from './model/MiMovimiento';
import { PokemonService } from './pokemon.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'diccionario-pokemon';
  public static TOT_X_PAGINA:number=10;
  public movimientos:MiMovimiento[]=[];
  public totalMovimientos:number=0;

  constructor(private pokeService: PokemonService){

  }

  async cargaMovimientos(){
    this.movimientos = await this.pokeService.listaMovimientos();
  }

  ngOnInit(){
    this.cargaMovimientos();
  }

}
