import { MapRealtimeSearchMarkupGroupAutocomplete } from './map-realtime-search-markup-group-autocomplete';
import { MapRealtimeService } from '../map-realtime.service';
import { Subscription } from 'rxjs';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Component, OnInit, Output, Input, EventEmitter, OnDestroy } from '@angular/core';

import { MapPositionFilter } from '../../map-position/map-position-filter';
import { MapPositionsService } from '../../map-position/map-positions.service';
import {Certificate} from "../../../certificate/certificate";
import {ClassificationType} from "../../../classification/classification-type";
import {Masks} from "../../../shared/forms/masks/masks";

@Component({
  selector: 'app-map-realtime-search',
  templateUrl: './map-realtime-search.component.html'
})
export class MapRealtimeSearchComponent implements OnInit, OnDestroy {
  loading: boolean = false;
  collapsed: boolean = false;

  form: FormGroup;

  filter: MapPositionFilter = new MapPositionFilter();

  positionSelectedSubscription: Subscription;
  markupGroupAutocomplete: MapRealtimeSearchMarkupGroupAutocomplete;
  markupGroupSubscription: Subscription;

  decimalMask = Masks.decimalMask;
  unlimitedDecimalMask = Masks.unlimitedDecimalMask;

  constructor(
    private formBuilder: FormBuilder,
    private service: MapPositionsService
  ) {}

  ngOnInit() {
    this.markupGroupAutocomplete = new MapRealtimeSearchMarkupGroupAutocomplete(this.service);
    this.buildForm();
    this.positionSelectedSubscription = this.service.positionSelected.subscribe(() => {
      this.collapsed = true;
    });
  }

  ngOnDestroy() {
    if (this.markupGroupSubscription != null && !this.markupGroupSubscription.closed) {
      this.markupGroupSubscription.unsubscribe();
    }

    if (this.positionSelectedSubscription && !this.positionSelectedSubscription.closed) {
      this.positionSelectedSubscription.unsubscribe();
    }
  }

  get markupGroups() {
    return Array.from(this.service.markupGroups.values());
  }

  get classItens() {
    let classItensIds = Array.from(this.service.classTypesAndValues.keys());
    var classItens = new Array<ClassificationType>();

    classItensIds.forEach(cii => {
      classItens = classItens.concat(this.service.classificationsTypes.get(cii));
    });
    classItens.sort((a,b)=> {
      if (a.name > b.name) return 1
      else if (a.name === b.name) return 0
      else return -1;
    });

    return classItens;
  }

  get certificates() {
    let certificates = this.service.certificates;

    certificates = certificates.filter(i => !!i);

    certificates = certificates.filter((item, index) => {
      return index === certificates.findIndex(c => c.id === item.id);
    });

    return certificates;
  }

  buildForm() {
    this.form = this.formBuilder.group({
      'clientName': [''],
      'batchOperationCode': [''],
      'batchCode': [''],
      'qualifiers': [''],
      'tagCode': [''],
      'fullPosition': [''],
      'markupGroupId': [''],
      'coffeeType': [''],
      'certificateId': [''],
      'refClient': [''],
      'itemType':[''],
      'itemValueString':[''],
      'itemValueIntervalMin':[''],
      'itemValueIntervalMax':[''],
      'itemValueEnum':[''],
    });

    this.markupGroupAutocomplete.value = null;

    this.markupGroupSubscription = this.markupGroupAutocomplete.valueChange.subscribe((value) => {
      const id = value ? value.id : null;
      this.form.get('markupGroupId').setValue(id);
    });
  }

  get selectedClasstype() {
    if (!this.form) {
      return null;
    }

    const classificationTypeId = this.form.value.itemType;

    if (!classificationTypeId) {
      return null;
    }

    const type = this.service.classificationsTypes.get(classificationTypeId);
    return type || null;
  }

  get selectedClasstypeEnums() {
    let classType = this.selectedClasstype;
    if(!!classType || classType.type === ClassificationType.ENUMERATOR){
      return this.service.classTypesAndValues.get(classType.id);
    }else {
      return [];
    }
  }


  clearSearch(){
    this.service.clearSearch();
  }

  submit() {
    Object.keys(this.form.controls).forEach((key) => {
      this.form.controls[key].markAsDirty();
    });
    if (!this.form.valid) {
      return;
    }
    if (!this.form.value['markupGroupId']) {
      this.service.markupGroupFilter = null;
    }
    this.collapsed = true;
    this.filter = MapPositionFilter.fromData(this.form.value);
    this.service.search(this.filter);
  }
}
