import { Component, Inject } from '@angular/core';
import { MiPokemon } from '../../model/classes/MiPokemon';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogTitle} from '@angular/material/dialog';
import { LoggingService } from '../../services/logging.service';

export interface ModalData {
  nombre: string,
  pokemon: MiPokemon
}

@Component({
  selector: 'app-modal-si-no',
  templateUrl: './modal-si-no.component.html',
  styleUrl: './modal-si-no.component.scss'
})
export class ModalSiNoComponent {

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: ModalData,
    private logger: LoggingService
  ) {
    this.logger.logVerbose(`[ModalSiNoComponent] Data: {nombre: ${data.nombre}}`);
  }
}
