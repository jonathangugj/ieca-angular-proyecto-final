import { Component} from '@angular/core';
import { MiPokemon } from '../../model/classes/MiPokemon';
import { PokemonService } from '../../services/pokemon.service';
import { PageEvent } from '@angular/material/paginator';
import { LoggingService } from '../../services/logging.service';
import { AppComponent } from '../../app.component';
import { Observable, Subject, of } from 'rxjs';

@Component({
  selector: 'app-busca',
  templateUrl: './busca.component.html',
  styleUrl: './busca.component.scss',
})
export class BuscaComponent {
  constructor(
    private api: PokemonService,
    private logger: LoggingService
  ){}

  public pokemones:MiPokemon[]=[];
  public totalPokemones: number=AppComponent.LIMITE_POKEMONES;
  public paginas: number[]=[];
  public padre:string="busca";
  public hayError:boolean=false;

  private async consultaPokemones(inicio: number, cantidad:number){
    this.logger.logVerbose("[BuscaComponent][consultaPokemones] Inicio");
    if (this.pokemones.length > 0) {
      this.logger.logVerbose("[BuscaComponent][consultaPokemones] Se depura lista de pokemones para nueva consulta ", this.pokemones.length);
      while(this.pokemones.length > 0) {
        this.pokemones.pop();
      }
    }
    if ((inicio+cantidad)>this.totalPokemones){
      this.logger.logVerbose("[BuscaComponent][consultaPokemones] Pokemones restantes menores a cantidad a solicitar");
      cantidad=this.totalPokemones-inicio;
    }
    try {
      let nombres = await this.api.getListaPokemon(inicio,cantidad);
      if (nombres.length != 0) {
        nombres.forEach(async (element) => {
          const pokemon = await this.api.getMiPokemonPorNombre(element);
          if (pokemon !== null)
            this.pokemones.push(pokemon);
        });   
      } 
    }catch (error) {
        this.hayError=true;
        this.logger.logError(`[BuscaComponent][consultaPokemones] ${error}`);
    }
  
    this.logger.logVerbose("[BuscaComponent][consultaPokemones] Fin");
  }

  ngOnInit(){
    this.logger.logInfo(`[BuscaComponent][ngOnInit]`);
    this.consultaPokemones(0, 5);
    this.hayError=false;
  }

  public handlePageEvent($event: PageEvent) {
    this.logger.logInfo(`[BuscaComponent][handlePageEvent] Cargando pagina [${$event.pageIndex}]`);
    this.consultaPokemones(($event.pageIndex * $event.pageSize), $event.pageSize);
  }

  public getError():Observable<boolean>{
    const hayError = of(this.hayError);
    return hayError;
  }
}
