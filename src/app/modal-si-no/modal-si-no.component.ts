import { Component, Inject } from '@angular/core';
import { MiPokemon } from '../model/MiPokemon';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogTitle} from '@angular/material/dialog';

export interface ModalData {
  pokemon: MiPokemon
}

@Component({
  selector: 'app-modal-si-no',
  templateUrl: './modal-si-no.component.html',
  styleUrl: './modal-si-no.component.scss'
})
export class ModalSiNoComponent {

  public respuestaSi:string="si";

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: ModalData
  ) {

  }

}
