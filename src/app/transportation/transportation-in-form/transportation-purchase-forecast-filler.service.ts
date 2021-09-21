import { FiscalNote } from '../../fiscal-note/fiscal-note';
import { PurchaseForecastService } from '../../purchase-forecast/purchase-forecast.service';
import { Transportation } from '../transportation';
import { Injectable } from '@angular/core';

@Injectable()
export class TransportationPurchaseForecastFiller {

  constructor(
    private purchaseForecastService: PurchaseForecastService,
  ) { }

  fill(transportation: Transportation, purchaseForecastId: string) {
    if (!purchaseForecastId) {
      return Promise.resolve();
    }

    return this.purchaseForecastService
      .find(purchaseForecastId)
      .then((purchaseForecast) => {
        if (transportation.fiscalNotes.findIndex((fn => fn.purchaseForecast && fn.purchaseForecast.id === purchaseForecast.id)) > -1) {
          return;
        }

        let fiscalNote = new FiscalNote();
        fiscalNote.code = purchaseForecast.fiscalNoteCode;
        fiscalNote.quantity = purchaseForecast.quantity;
        fiscalNote.unitPrice = purchaseForecast.unitPrice;
        fiscalNote.strainer = purchaseForecast.strainer;
        fiscalNote.senderStakeholder = purchaseForecast.senderStakeholder;
        fiscalNote.emissionDate = purchaseForecast.emissionDate;
        fiscalNote.senderCity = purchaseForecast.senderCity;
        fiscalNote.ownerStakeholder = purchaseForecast.ownerStakeholder;
        fiscalNote.drink = purchaseForecast.drink;
        fiscalNote.grossWeight = purchaseForecast.grossWeight;
        fiscalNote.netWeight = purchaseForecast.netWeight;
        fiscalNote.totalPrice = purchaseForecast.totalPrice;
        fiscalNote.baseValueForTax = purchaseForecast.baseValueForTax;
        fiscalNote.taxIcmsPercent = purchaseForecast.taxIcmsPercent;
        fiscalNote.purchaseCode = purchaseForecast.purchaseCode;
        fiscalNote.barCode = purchaseForecast.barCode;
        fiscalNote.purchaseForecast = purchaseForecast;

        transportation.purchaseForecastFiscalNote = fiscalNote;

        if (transportation.id) {
          return;
        }

        transportation.carrier = purchaseForecast.carrier;
        transportation.vehiclePlate1 = purchaseForecast.vehiclePlate1;
        transportation.vehiclePlate2 = purchaseForecast.vehiclePlate2;
        transportation.driverName = purchaseForecast.driverName;
        transportation.originWeight = purchaseForecast.originWeight;
        return;
      });
  }
}
