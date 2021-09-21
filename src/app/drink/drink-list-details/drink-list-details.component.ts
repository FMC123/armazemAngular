import { ModalManager } from '../../shared/modals/modal-manager';

import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Notification } from './../../shared/notification/notification';
import {Drink} from '../drink';
import {DrinkService} from '../drink.service';

@Component({
  selector: 'app-drink-list-details',
  templateUrl: './drink-list-details.component.html'
})
export class DrinkDetailsComponent implements OnInit {
  drink: Drink;

  constructor(private route: ActivatedRoute,
              private drinkService: DrinkService) { }

  ngOnInit() {
    Notification.clearErrors();
    this.route.data.forEach((data: {drink: Drink}) => {
      this.drink = data.drink;
    });
  }

}
