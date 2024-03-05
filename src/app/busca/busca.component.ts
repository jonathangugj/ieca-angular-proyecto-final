import { Component, Input } from '@angular/core';
import { MiPokemon } from '../model/MiPokemon';
import { PokemonService } from '../pokemon.service';
import { AppComponent } from '../app.component';
import { DetalleComponent } from '../detalle/detalle.component';
import { Utilidades } from '../model/Utilidades';
import { MiMovimiento } from '../model/MiMovimiento';

@Component({
  selector: 'app-busca',
  templateUrl: './busca.component.html',
  styleUrl: './busca.component.scss',
})
export class BuscaComponent {

  constructor(private pokeService: PokemonService){}

  @Input() movimientos?: MiMovimiento[];
  
  public pokemones:MiPokemon[]=[];
  public totalPokemones: number=0;
  public numeroPaginas:number=0;
  public paginas: number[]=[];
  public hayPaginacion:boolean=false;
  public elementos: number = AppComponent.TOT_X_PAGINA;

  async consultaPokemones(inicio: number, cantidad:number){
    Utilidades.aLog("inicio consultaPokemones");
    let nombres = await this.pokeService.getListaPokemon(inicio,cantidad);
    if (nombres.length != 0) {
      try {
        nombres.forEach(async (element) => {
          const pokemon = await this.pokeService.getMiPokemonPorNombre(element);
          if (pokemon !== null)
            this.pokemones.push(pokemon);
        });   
      } catch (error) {
        console.error(error);
      }
    }
    this.pokemones.sort((a,b)=>{
      if (a.id < b.id)
        return -1;
      else if (a.id > b.id)
        return 1;
      else
        return 0; 
    });
    Utilidades.aLog("fin consultaPokemones");
  }

  async setPaginacion(){
    Utilidades.aLog("inicio setPaginacion");
    try {
      this.totalPokemones = await this.pokeService.getTotalPokemones();
      this.numeroPaginas=Math.floor(this.totalPokemones/AppComponent.TOT_X_PAGINA); 
      if(this.totalPokemones%AppComponent.TOT_X_PAGINA!==0)
        this.numeroPaginas++;
      if(this.numeroPaginas > 1){
        this.hayPaginacion=false;
        for (let index = 0; index < this.numeroPaginas; index++) {
          this.paginas.push(index)
        }
      }
      Utilidades.aLog(`Total de pokemones: ${this.totalPokemones}`);
      Utilidades.aLog(`Numero de paginas: ${this.numeroPaginas}`);  
    } catch (error) {
      console.error(error);
    }
    Utilidades.aLog("fin setPaginacion");
  }

  ngOnInit(){
    this.consultaPokemones(0, AppComponent.TOT_X_PAGINA);
    this.setPaginacion();
  }

}
