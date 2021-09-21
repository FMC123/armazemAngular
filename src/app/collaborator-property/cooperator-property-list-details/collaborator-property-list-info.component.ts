import { ModalManager } from '../../shared/modals/modal-manager';
import { Component, Input, OnInit } from '@angular/core';
import {CollaboratorProperty} from "../collaborator-property";

@Component({
  selector: 'app-collaborator-property-list-info',
  templateUrl: './collaborator-property-list-info.component.html'
})
export class CollaboratorPropertyListInfoComponent implements OnInit {
    @Input() collaboratorProperty: CollaboratorProperty;

    logModal: ModalManager = new ModalManager();

    leftColumn: Array<any>;

    ngOnInit() {

      this.leftColumn = [
        ['Cooperado', this.collaboratorProperty.collaborator.person.name],
        ['Propriedade', this.collaboratorProperty.farm.name],
        ['Cultura', this.collaboratorProperty.cultivation.cultivationName],
        ['% Percentual', this.collaboratorProperty.percentProperty]
      ];
    }
}
