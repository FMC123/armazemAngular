import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {Notification} from '../../shared/notification';
import {Contaminant} from "../contaminant";

@Component({
  selector: 'app-contaminant-list-details',
  templateUrl: './contaminant-list-details.component.html'
})
export class ContaminantDetailsComponent implements OnInit {
  contaminant: Contaminant;
  leftColumn: Array<any>;

  constructor(private route: ActivatedRoute) {
  }

  ngOnInit() {
    Notification.clearErrors();
    this.route.data.forEach((data: { contaminant: Contaminant }) => {
      this.contaminant = data.contaminant;
    });
    this.leftColumn = [
      ['Nome', this.contaminant.name],
      ['Descrição', this.contaminant.description],
      ['Alergênico', this.contaminant.allergenic ? 'Sim' : 'Não'],
      ['Rastreável', this.contaminant.traceable ? 'Sim' : 'Não']
    ];
  }

}
