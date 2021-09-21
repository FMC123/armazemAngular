import { AbstractControl, FormGroup } from '@angular/forms';
import { EventEmitter, Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class AutocompleteService {
  valueChange: EventEmitter<any> = new EventEmitter<any>();

  valueControl: AbstractControl;
  searchControl: AbstractControl;

  selected: any = null;
  loading: boolean;
  noResults: boolean;
  datasource: Observable<any>;

  constructor(public optionField: string,
              optionsLimit?: number) {}

  mount(searchControl: AbstractControl) {
    this.searchControl = searchControl;
    this.datasource = Observable.create((observer: any) => {
      observer.next(searchControl.value);
    }).mergeMap((token) => this.load(token));
  }

  load(token: string): Observable<any> {
    throw 'Not implemented!';
  }

  get label(){
    if (!this.selected) {
      return null;
    }
    return this.selected.item[this.optionField];
  }

  get value(){
    if (!this.selected) {
      return null;
    }
    return this.selected.item;
  }

  clean(el) {
    this.searchControl.setValue(null);
    this.select(null);
    window.setTimeout(() => el.focus(), 0);
  }

  select(arg) {
    if (this.selected !== arg) {
      this.selected = arg;
      this.valueChange.emit(this.value);
    }
  }

  setNoResults(arg) {
    this.noResults = arg;
    if (this.selected !== null) {
      this.selected = null;
      this.valueChange.emit(this.value);
    }
  }

  setLoading(arg) {
    this.loading = arg;
    if (this.loading) this.noResults = false;
    if (this.selected !== null) {
      this.selected = null;
      this.valueChange.emit(this.value);
    }
  }
}
