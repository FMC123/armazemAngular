import { MapZones } from '../map-zones';
import { Zone } from '../../../zone/zone';
import { Subscription } from 'rxjs/Rx';
import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Colors } from "../../../color/colors";
import { MapZonePositionsService } from "../map-zone-position/map-zone-positions.service";

@Component({
  selector: 'app-map-zone-list',
  templateUrl: './map-zone-list.component.html',
  styles: [`colorbox,.colorbox { display:inline-block; height:14px; width:14px;margin-right:4px; border:1px solid #000;}`],
  encapsulation: ViewEncapsulation.None  // Enable dynamic HTML styles
})
export class MapZoneListComponent implements OnInit {
  private value: any = {};
  private _disabledV: string = '0';
  private disabled: boolean = false;
  private items: Array<any> = [];
  private corlorSelect: any;
  private colors = new Colors();

  constructor(
    private service: MapZonePositionsService,
    private mapZones: MapZones,
  ) { }

  ngOnInit() {
    this.listZone.forEach((zone) => {
      this.items.push({
        id: zone.id,
        index: zone.index,
        text: `<colorbox style='background-color:${this.colors.value[zone.index]};'></colorbox>(${zone.name})`,
      });

    });
  }

  get listZone() {
    return this.mapZones.value;
  }

  private get disabledV(): string {
    return this._disabledV;
  }

  private set disabledV(value: string) {
    this._disabledV = value;
    this.disabled = this._disabledV === '1';
  }

  public selected(value: any) {
    value = this.listZone.find(i => i.id === value.id);
    this.service.selectZone(value);
  }

  private removed(value: any) {
    console.log('Removed value is: ', value);
  }

  private typed(value: any) {
    console.log('New search input: ', value);
  }

  private refreshValue(value: any) {
    this.value = value;
  }
}
