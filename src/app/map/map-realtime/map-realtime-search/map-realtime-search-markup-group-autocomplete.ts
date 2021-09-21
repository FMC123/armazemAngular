import { Observable } from 'rxjs/Rx';

import { Autocomplete } from '../../../shared/forms/autocomplete/autocomplete';
import { MapRealtimeService } from '../map-realtime.service';
import {MapPositionsService} from "../../map-position/map-positions.service";

export class MapRealtimeSearchMarkupGroupAutocomplete extends Autocomplete {

  constructor(
    private service: MapPositionsService,
  ) {
    super('label', 999);
  }

  load(search: string) {
    let markupGroups = Array.from(this.service.markupGroups.values())
      .filter((mg) => {
        return (mg.label || '').toLowerCase().includes((search || '').toLowerCase());
      })
      .map((mg) => {
        return {
          id: mg.id,
          label: mg.label,
        };
      });

    markupGroups.sort((a, b) => a.label.localeCompare(b.label));

    return Observable.of(markupGroups);
  }
}
