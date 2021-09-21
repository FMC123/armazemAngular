import { Observable } from 'rxjs/Rx';
import { Autocomplete } from '../shared/forms/autocomplete/autocomplete';
import { ServiceItem } from './service-item';

/**
 * Busca de auto completar para itens do serviço
 */
export class ServiceItemAutocomplete extends Autocomplete {

  items: Array<ServiceItem>;

  constructor() {
    super('label', 10);
  }

  /**
   * Informa a lista de itens, para fazer a busca sobre esses registros e não precisar fazer consultas no BD
   *
   * @param items
   */
  setItems(items: Array<ServiceItem>) {
    this.items = [...items];
  }

  load(search: string) {

    let list = new Array<ServiceItem>();

    // efetua busca
    if (this.items != null && this.items.length > 0) {

      if (search != null && search.trim() != '') {
        this.items.forEach(item => {
          if (item.label.toUpperCase().indexOf(search.toUpperCase()) > -1) {
            list.push(item);
          }
        });
      }
      else {
        // se não tem critério traz todas
        list = this.items;
      }
    }

    return Observable.fromPromise(
      new Promise((resolve, reject) => {
        resolve(list);
      }).then((data) => { return data; })
    );
  }
}
