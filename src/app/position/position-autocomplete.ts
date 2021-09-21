import { Observable } from 'rxjs/Rx';
import { Autocomplete } from '../shared/forms/autocomplete/autocomplete';
import { Position } from './position';

export class PositionAutocomplete extends Autocomplete {

  positions: Array<Position>;

  constructor() {
    super('nameCode', 50);
  }

  /**
   * Informa a lista de posições, para fazer a busca sobre esses registros e não precisar fazer consultas no BD
   * 
   * @param positions 
   */
  setPositions(positions: Array<Position>) {
    this.positions = positions;
  }

  load(search: string) {

    let positionsSearch = new Array<Position>();

    // efetua busca
    if (search != null && search.trim() != ''
      && this.positions != null && this.positions.length > 0) {

      this.positions.forEach(position => {
        if (position.nameCode.toUpperCase().indexOf(search.toUpperCase()) > -1) {
          positionsSearch.push(position);
        }
      });
    }

    return Observable.fromPromise(
      new Promise((resolve, reject) => {
        resolve(positionsSearch);
      }).then((data) => { return data; })
    );
  }
}