import { Page } from './page';
import { Directive, HostBinding, HostListener, Input, OnInit } from '@angular/core';

@Directive({
  selector: '[appSort]'
})
export class SortDirective implements OnInit {

  @Input() instance: Page<any>;
  @Input('appSort') sortBy: string;

  @HostBinding('class.sorting_asc')
  asc: boolean = false;
  @HostBinding('class.sorting_desc')
  desc: boolean = false;
  @HostBinding('class.sorting')
  none: boolean = true;

  constructor() {}

  ngOnInit() {
    this.adjustSort();
    this.instance.changeQuery.subscribe(() => {
      this.adjustSort();
    });
  }

  adjustSort(){
    this.asc = (this.instance.sortBy === this.sortBy && this.instance.sortOrder === Page.SORT_ASC);
    this.desc = (this.instance.sortBy === this.sortBy && this.instance.sortOrder === Page.SORT_DESC);
    this.none = !this.asc && !this.desc;
  }

  @HostListener('click') onClick() {
    if (!this.instance.loading) {
      this.sort();
    }
  }

  private sort() {
      if (this.asc) {
          this.instance.setSort(this.sortBy, 'desc');
      } else {
          this.instance.setSort(this.sortBy, Page.SORT_ASC);
      }
  }
}
