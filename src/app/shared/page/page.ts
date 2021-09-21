import { EventEmitter } from '@angular/core';
import { URLSearchParams } from '@angular/http';

export class Page<T> {

  static SORT_ASC: string = 'ASC';
  static SORT_DESC: string = 'DESC';

  changeQuery: EventEmitter<any> = new EventEmitter<any>();
  changeResult: EventEmitter<any> = new EventEmitter<any>();

  data: Array<T> = [];
  loading: boolean = false;
  sortBy: string = '';
  sortOrder: string = Page.SORT_ASC;

  itemsPerPage: number = 10;
  currentPage: number = 1;
  totalItems: number = 0;

  public setResultFromServer(serverData: any, idsToKeepUntouched: Array<string> = null) {
    if (idsToKeepUntouched) {
      let itemsToKeepUntouched = this.data.filter(i => idsToKeepUntouched.includes((<any>i).id));

      for (let i = 0; i < serverData.content.length; i++) {
        let existingItem = itemsToKeepUntouched.find(j => serverData.content[i].id === (<any>j).id);
        if (existingItem) {
          serverData.content[i] = existingItem;
        }
      }
    }

    this.setResult(
      serverData.content,
      serverData.totalElements,
      serverData.sort && serverData.sort[0] ? serverData.sort[0].property : null,
      serverData.sort && serverData.sort[0] ? serverData.sort[0].direction : null,
    );
  }

  public toURLSearchParams(): URLSearchParams {
    let params: URLSearchParams = new URLSearchParams();
    if (this.sortBy) {
      params.set('sort', this.sortBy + ',' + this.sortOrder);
    }
    if (this.currentPage) {
      params.set('page', (this.currentPage - 1).toString());
    }
    if (this.itemsPerPage) {
      params.set('size', this.itemsPerPage.toString());
    }
    return params;
  }

  public setResult(
    data: Array<T>,
    totalItems: number,
    sortBy?: string,
    sortOrder?: string
  ) {
    this.data = data;
    this.totalItems = totalItems || 0;
    if (sortBy) {
      this.sortBy = sortBy;
    }
    if (sortOrder) {
      this.sortOrder = sortOrder.toUpperCase();
    }
    this.changeResult.emit();
  }

  get initialIndex(){
    return (this.currentPage - 1) * this.itemsPerPage;
  }

  get lastIndex(){
    return this.initialIndex + this.itemsPerPage;
  }

  public setSort(by: string, order: string) {
    this.sortBy = by;
    order = order || '';
    this.sortOrder = order.toUpperCase();
    this.changeQuery.emit();
  }

  public setCurrentPage(page: number) {
    let maxPage = Math.ceil(this.totalItems / this.itemsPerPage);
    if (page <= maxPage && 1 <= page) {
        this.currentPage = page;
        this.changeQuery.emit();
    }
  }

  public setItemsPerPage(itemsPerPage: number) {
    this.itemsPerPage = itemsPerPage;
    this.changeQuery.emit();
  }

}
