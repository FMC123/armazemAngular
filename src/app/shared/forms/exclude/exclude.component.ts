import { EventEmitter } from '@angular/common/src/facade/async';
import { Component, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-exclude',
  templateUrl: 'exclude.component.html'
})

export class ExcludeComponent implements OnInit {

  @Output() onExclude = new EventEmitter<{event: Event, excluded: boolean}>();
  excluded: boolean = false;
  constructor() { }

  ngOnInit() { }

  exclude(event: Event, excluded: boolean) {
    event.stopPropagation();
    this.onExclude.emit({event, excluded});
    this.excluded = excluded;
  }
}
