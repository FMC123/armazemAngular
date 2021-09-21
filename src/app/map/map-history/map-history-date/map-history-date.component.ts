import { Subject } from 'rxjs/Rx';
import { MapHistoryService } from '../map-history.service';
import { DateTimeHelper } from '../../../shared/globalization';
import { CustomValidators } from '../../../shared/forms/validators/custom-validators';
import { Masks } from '../../../shared/forms/masks/masks';
import { Component, EventEmitter, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-map-history-date',
  templateUrl: './map-history-date.component.html'
})
export class MapHistoryDateComponent implements OnInit {
  form: FormGroup;
  dateMask: any = Masks.dateMask;
  previousDate: string = null;

  constructor(private formBuilder: FormBuilder,
              private mapHistoryService: MapHistoryService) { }

  ngOnInit() {
    this.previousDate = DateTimeHelper.toDDMMYYYY(+new Date());
    this.form = this.formBuilder.group({
      'dateString': [this.previousDate, CustomValidators.dateValidator()]
    });
    this.form.get('dateString').valueChanges.subscribe((value) => {
      // Avoid reload when does not change
      if (this.previousDate && this.previousDate === value) {
        return;
      }
      if (this.form.get('dateString').valid) {
        this.previousDate = value;
        if (value && value.length === 10) {
          this.mapHistoryService.refresh(DateTimeHelper.fromDDMMYYYY(value));
        }else {
          this.mapHistoryService.refresh(null);
        }
      }
    });
  }

}
