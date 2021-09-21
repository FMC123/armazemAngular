import { NgModule }            from '@angular/core';
import { CommonModule }        from '@angular/common';

import { PaginationComponent } from './pagination.component';
import { SortDirective } from './sort.directive';

@NgModule({
  imports:      [ CommonModule ],
  declarations: [ PaginationComponent, SortDirective ],
  exports:      [ PaginationComponent, SortDirective ]
})
export class PageModule { }
