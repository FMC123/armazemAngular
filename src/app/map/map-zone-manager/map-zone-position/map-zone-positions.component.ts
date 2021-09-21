import { AfterViewInit, Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import {MapZonePositionsService} from "./map-zone-positions.service";
import {MapZonePosition} from "./map-zone-position";

@Component({
  selector: 'app-map-zone-positions',
  templateUrl: './map-zone-positions.component.html'
})
export class MapZonePositionsComponent implements OnInit {

  svgHeight: number = 0;
  svgWidth: number = 0;


  constructor(private route: ActivatedRoute,
              private service: MapZonePositionsService,
              ) { }

  ngOnInit() {
    if (this.positions && this.positions.length > 0) {
      this.populateSvgDimentions();
    }
  }

  get positions(){
    return this.service.positions;
  }

  get circles() {
    return this.service.positions.filter((mp) => mp.circle );
  }

  get rects() {
    return this.service.positions.filter((mp) => mp.rect );
  }

  select(position: MapZonePosition) {
    this.service.togglePosition(position);
  }

  private populateSvgDimentions() {
    let margin = (2 * MapZonePosition.proportion);
    this.svgHeight = Math.max(...this.service.positions.map((p) => p.y)) + margin;
    this.svgWidth = Math.max(...this.service.positions.map((p) => p.x)) + margin;
  }
}
