import { TrackingService } from '../tracking.service';
import { MapTrackingPosition } from './map-tracking-position';
import { Component, Input, OnInit } from '@angular/core';

@Component({
  moduleId: module.id,
  selector: 'app-map-tracking',
  templateUrl: 'map-tracking.component.html'
})

export class MapTrackingComponent implements OnInit {

  @Input() positions: Array<MapTrackingPosition>;

  svgHeight = 0;
  svgWidth = 0;

  constructor(
    public trackingService: TrackingService,
  ) { }

  ngOnInit() {
    this.populateSvgDimentions();
  }

  toggleSelect(position: MapTrackingPosition) {
    this.trackingService.toggleSelectPosition(position);
  }


  private populateSvgDimentions() {
    let margin = (2 * MapTrackingPosition.proportion);
    this.svgHeight = Math.max(...this.positions.map((p) => p.y)) + margin;
    this.svgWidth = Math.max(...this.positions.map((p) => p.x)) + margin;
  }
}
