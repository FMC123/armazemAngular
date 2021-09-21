import { Position } from '../../position/position';
import { MapPosition } from './map-position';
import { MapPositionsService } from './map-positions.service';
import { AfterViewInit, Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import {PositionType} from "../../position/position-type";

@Component({
  selector: 'app-map-positions',
  templateUrl: './map-positions.component.html'
})
export class MapPositionsComponent implements OnInit {
  svgHeight: number = 0;
  svgWidth: number = 0;

  constructor(
    private route: ActivatedRoute,
    private service: MapPositionsService
  ) { }

  ngOnInit() {
    if (this.service.positions && this.service.positions.size > 0) {
      this.populateSvgDimentions();
    }
  }

  get positionsToDisplay() {
    return this.service.positionsToDisplay;
  }

  select(position: MapPosition) {
    this.service.selectPosition(position);
  }

  descriptiveFontSize(position) {
    if (position.type === PositionType.DESCRITIVO.code) {
      return {'font-size': position.discriptiveTextSize}
    }
  }

  rectHidden(position){
    let hiddenRect:any = false;
    if(position.type == "DC" && !position.isStack){
      return false;
    }
    if(position.type == "DC" && position.isStack){
      hiddenRect = true;
    }
    if(position.active && position.rect){
      hiddenRect = true;
    }
    return hiddenRect;
  }

  private populateSvgDimentions() {
    let margin = 2 * MapPosition.proportion;
    this.svgHeight = Math.max(...Array.from(this.service.positions.values()).map(p => p.y)) + margin;
    this.svgWidth = Math.max(...Array.from(this.service.positions.values()).map(p => p.x)) + margin;
  }
}
