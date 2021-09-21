import { ActivatedRoute } from '@angular/router';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-purchase-forecast',
  templateUrl: 'purchase-forecast.component.html'
})

export class PurchaseForecastComponent implements OnInit {
  unified = false;
  breadcrumb = null;

  constructor(
    private route: ActivatedRoute,
  ) { }

  ngOnInit() {
    this.route.data.forEach((data: { unified: boolean }) => {
      this.unified = data.unified;
    });

    this.buildBreadcrumb();
  }

  buildBreadcrumb() {
    let output = [];

    output.push(['Início', '']);

    if (this.unified) {
      output.push(['Balança', '/balance']);
    } else {
      output.push(['Portaria', '/lobby']);
    }

    output.push(['Previsão de Entrada', null]);

    this.breadcrumb = output;
  }
}
