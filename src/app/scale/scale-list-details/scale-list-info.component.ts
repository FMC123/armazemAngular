import { Scale } from '../scale';
import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-scale-list-info',
  templateUrl: './scale-list-info.component.html'
})
export class ScaleListInfoComponent implements OnInit {
  @Input() scale: Scale;

  leftColumn: Array<any>;

  public ngOnInit(): void {
    this.leftColumn = [
      ['IP', this.scale.ip],
      ['Descrição', this.scale.description],
      ['Armazém', this.scale.warehouse.name],
    ];
  }
}
