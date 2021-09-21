import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-info-table',
  templateUrl: './info-table.component.html'
})
export class InfoTableComponent implements OnInit {

  @Input() data: Array<Array<any>> = [];
  @Input() header: string;

  constructor() { }

  ngOnInit() { }

  options(map) {
    if (map) {
      if (map.length > 2) {
        return map[2];
      }
    }
    return null;
  }

  color(map) {
    if (this.options(map)
        && this.options(map).color) {
      return this.options(map).color;
    }else {
      return 'black';
    }
  }

  backgroundColor(map) {
    if (this.options(map)
        && this.options(map).backgroundColor) {
      return this.options(map).backgroundColor;
    }else {
      return 'white';
    }
  }

}
