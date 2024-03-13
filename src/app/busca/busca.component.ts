import { Component} from '@angular/core';
import { MiPokemon } from '../model/MiPokemon';
import { PokemonService } from '../pokemon.service';
import { PageEvent } from '@angular/material/paginator';
import { LoggingService } from '../logging.service';
import { AppComponent } from '../app.component';

@Component({
  selector: 'app-busca',
  templateUrl: './busca.component.html',
  styleUrl: './busca.component.scss',
})
export class BuscaComponent {
  constructor(
    private pokeService: PokemonService,
    private logger: LoggingService
  ){}

  public pokemones:MiPokemon[]=[];
  public totalPokemones: number=AppComponent.LIMITE_POKEMONES;
  public paginas: number[]=[];
  public padre:string="busca";

  private async consultaPokemones(inicio: number, cantidad:number){
    this.logger.logVerbose("[BuscaComponent] Inicio consultaPokemones");
    if (this.pokemones.length > 0) {
      this.logger.logVerbose("[BuscaComponent] Se depura lista de pokemones para nueva consulta ", this.pokemones.length);
      while(this.pokemones.length > 0) {
        this.pokemones.pop();
      }
    }
    if ((inicio+cantidad)>this.totalPokemones){
      this.logger.logVerbose("[BuscaComponent] Pokemones restantes menores a cantidad a solicitar");
      cantidad=this.totalPokemones-inicio;
    }
    this.logger.logVerbose(`[BuscaComponent] Inicio consultaPokemones, inicio:[${inicio}], cantidad:[${cantidad}]`);
    let nombres = await this.pokeService.getListaPokemon(inicio,cantidad);
    if (nombres.length != 0) {
      try {
        nombres.forEach(async (element) => {
          const pokemon = await this.pokeService.getMiPokemonPorNombre(element);
          if (pokemon !== null)
            this.pokemones.push(pokemon);
        });   
      } catch (error) {
        this.logger.logError(error);
      }
    }
    // this.pokemones.sort((a,b)=>{
    //   if (a.id < b.id)
    //     return -1;
    //   else if (a.id > b.id)
    //     return 1;
    //   else
    //     return 0; 
    // });
    this.logger.logVerbose("[BuscaComponent] Fin consultaPokemones");
  }

  ngOnInit(){
    this.logger.logInfo(`[BuscaComponent] Total de pokemones: ${this.totalPokemones}`);
    this.consultaPokemones(0, 5);
  }

  public handlePageEvent($event: PageEvent) {
    this.logger.logVerbose("[BuscaComponent] Cargando pagina seleccionada");
    this.consultaPokemones(($event.pageIndex * $event.pageSize), $event.pageSize);
  }

}
