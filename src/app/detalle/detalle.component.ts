import { Component, Input } from '@angular/core';
import { MiPokemon } from '../model/MiPokemon';

@Component({
  selector: 'app-detalle',
  templateUrl: './detalle.component.html',
  styleUrl: './detalle.component.scss'
})
export class DetalleComponent {

  @Input() pokemon?: MiPokemon;
}
