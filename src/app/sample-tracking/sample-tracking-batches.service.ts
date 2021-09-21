import {EventEmitter, Injectable, Output} from '@angular/core';
import { Batch } from '../batch/batch';
import {BehaviorSubject} from "rxjs/BehaviorSubject";
import {Warehouse} from "../warehouse/warehouse";
import {Sample} from "../sample/sample";

@Injectable()
export class SampleTrackingBatchesService {
  private resultSamplesArray : Array<Sample> = [];
  private selectedSamplesArray : Array<Sample> = [];

  constructor(){

  }

  public changeSamples(samples : Array<Sample>){
    if(samples)
      this.resultSamplesArray = samples;
  }

  public resultSamples(warehouse:Warehouse){
    if (!this.resultSamplesArray) {
      return [];
    }

    return this.resultSamplesArray.filter(
      a => a.warehouse.id === warehouse.id
    );

  }

  public resultSamplesAll(){
    if (!this.resultSamplesArray) {
      return [];
    }
    return this.resultSamplesArray;
  }

  public selectedSamples(warehouse:Warehouse){
    if (!this.selectedSamplesArray) {
      return [];
    }

    return this.selectedSamplesArray.filter(
      a => a.warehouse === warehouse
    );

  }

  public selectedSamplesAll(){
    if (!this.selectedSamplesArray) {
      return [];
    }
    return this.selectedSamplesArray;
  }

  get resultWarehouses(){
    let warehouses: Array<Warehouse> = [];

    if (!this.resultSamplesArray) {
      return [];
    }

    this.resultSamplesArray.forEach(a => {
      let found = false;

      warehouses.forEach(warehouse => {
        if(warehouse.id === a.warehouse.id){
          found = true;
        }
      });

      if(!found)
        warehouses.push(a.warehouse);
    });

    return warehouses;
  }

  get selectedWarehouses(){
    let warehouses: Array<Warehouse> = [];

    if (!this.selectedSamplesArray) {
      return [];
    }

    this.selectedSamplesArray.forEach(a => {
      if(warehouses.indexOf(a.warehouse) < 0)
        warehouses.push(a.warehouse);
    });

    return warehouses;
  }

  public addToSelecteds(sample: Sample){
    if(this.selectedSamplesArray.indexOf(sample) < 0)
      this.selectedSamplesArray.push(sample);
  }

  public removeFromSelecteds(sample: Sample){
    const index: number = this.selectedSamplesArray.indexOf(sample);
    if (index !== -1) {
      this.selectedSamplesArray.splice(index, 1);
    }
  }

  public removeAllSelecteds(){
    this.selectedSamplesArray = [];
  }

  public removeAllResult(){
    this.resultSamplesArray = [];
  }

}
