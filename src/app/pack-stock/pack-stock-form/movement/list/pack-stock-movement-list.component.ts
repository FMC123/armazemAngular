import { ModalManager } from '../../../../shared/modals/modal-manager';
import { PackStockMovement } from '../../../pack-stock-movement';
import { PackStockMovementGroup } from '../../../pack-stock-movement-group';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import {NumberHelper} from "../../../../shared/globalization";

@Component({
  selector: 'app-pack-stock-movement-list',
  templateUrl: 'pack-stock-movement-list.component.html'
})

export class PackStockMovementListComponent implements OnInit {
  @Input() group: PackStockMovementGroup;
  @Input() editable = true;
  @Input() readOnly = false;
  @Output() edit = new EventEmitter<PackStockMovement>(false);

  deleteConfirm: ModalManager = new ModalManager();
  numberHelper = NumberHelper;

  get movements() {
    return this.group.movements;
  }

  constructor() {}

  ngOnInit() {}

  onEditClick(event: Event, movement: PackStockMovement) {
    event.stopPropagation();
    this.edit.emit(movement);
  }

  onDeleteClick(event: Event, movement: PackStockMovement) {
    event.stopPropagation();
    this.deleteConfirm.open(movement);
  }

  delete(movement: PackStockMovement) {
    let index = this.movements.findIndex(fn => {
      return (!!movement.id && fn.id === movement.id)
      || (!!movement.tempId || fn.tempId === movement.tempId)
    });

    this.movements.splice(index, 1);
  }

}
