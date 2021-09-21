import { Subject } from 'rxjs/Subject';

export class Search {

  public value: string = null;
  private terms = new Subject<string>();

  subscribe(callback: (() => void)){
    this.terms
        .debounceTime(300)
        .distinctUntilChanged()
        .subscribe((term) => {
          this.value = term;
          callback();
        });
  }

  next(term: string) {
    this.terms.next(term);
  }

  destroy() {
    this.terms.unsubscribe();
  }
}
