import { ActivatedRoute } from '@angular/router';
import { BalanceService } from './balance.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-balance',
  templateUrl: 'balance.component.html'
})

export class BalanceComponent implements OnInit {
  unified = false;

  constructor(
    private balanceService: BalanceService,
    private route: ActivatedRoute,
  ) { }

  ngOnInit() {
    this.route.data.forEach((data: { unified: boolean }) => {
      this.unified = data.unified;
    });
  }

  get scale() {
    return this.balanceService.scale;
  }
}
