import { Injectable, NgZone } from '@angular/core';

@Injectable()
export class AppState {

  loading: boolean = false;
  menuVisible = true;
  filter = [];
  data = {};

  constructor(private ngZone: NgZone) {}

  setLoading(loading: boolean) {
    this.ngZone.run(() => {
      this.loading = loading;
    });
  }

  toggleMenu() {
    this.menuVisible = !this.menuVisible;
  }

  showMenu() {
    this.menuVisible = true;
  }

  hideMenu() {
    this.menuVisible = false;
  }

  setFilter(pKey: string, pValue: Object) {
    this.filter.push({ key: pKey, value: pValue});
  }

  getFilter(pKey: string) {
    return this.filter.find(f => f.key == pKey);
  }

  // filter as being used in batch-operation-filter
  setData(key: string, value: any) {
    this.data[key] = value;
  }

  getData(key: string): any {
    return this.data[key];
  }

  removeData(key: string) {
    delete this.data[key];
  }
}
