import { Injectable } from '@angular/core';
import { ParameterService } from '../../parameter/parameter.service';
import { Batch } from 'app/batch/batch';
import { NumberHelper } from '../../shared/globalization';

@Injectable()
export class KilosSacksConverterService {

  sacksInKilos = 0;

  constructor(private parameterService: ParameterService) {
    this.parameterService.sacksInKilos().then((sacksInKilos) => {
      this.sacksInKilos = sacksInKilos;
    });
  }

  kilosToSacks(kilos: number, batch?: Batch, sacksInKilos?: number) {

    let sacks = 0;

    // se tem a média do batch, utiliza ele
    if (kilos && batch != null && batch.averageWeightSack != null && batch.averageWeightSack > 0)
        sacks = Math.round(kilos / batch.averageWeightSack);

    // se tem parâmetro de sacas em quilos, utiliza ele
    else if (kilos && sacksInKilos != null && sacksInKilos > 0) {
      sacks = Math.round(kilos / sacksInKilos);
    }
    else if (!this.sacksInKilos || !kilos) {
      return 0;
    }
    // parâmetro das sacas em quilos
    else {
      sacks = Math.floor(kilos / this.sacksInKilos);
    }

    // se tem algum quilo, deve ter pelo menos uma saca
    if (kilos && !sacks) {
      sacks = 1;
    }

    return sacks;
  }

  sacksToKilos(sacks: number, batch?: Batch, sacksInKilos?: number):number {

    // se tem a média do batch, utiliza ele
    if (sacks && batch != null && batch.averageWeightSack != null && batch.averageWeightSack > 0) {
      return sacks * batch.averageWeightSack;
    }

    // se foi informado sacas em quilos, utiliza ele para calcular,
    // senão usa valor do parâmetro
    if (sacks && sacksInKilos && sacksInKilos > 0) {
      return sacks * sacksInKilos;
    }

    if (!this.sacksInKilos || !sacks) {
      return 0;
    }

    return sacks * this.sacksInKilos;
  }
}
