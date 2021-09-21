import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {Notification} from '../../shared/notification';
import {Sku} from "../sku";
import {SkuService} from "../sku.service";
import {ErrorHandler} from "../../shared/shared.module";

@Component({
  selector: 'app-sku-creator',
  templateUrl: './sku-creator.component.html'
})
export class SkuCreatorComponent implements OnInit {
  loading: boolean;
  sku: Sku;

  constructor(private route: ActivatedRoute,
              private skuService: SkuService,
              private router: Router,
              private errorHandler: ErrorHandler) {
  }

  ngOnInit() {
    this.loading = true;
    Notification.clearErrors();
    this.route.data.forEach((data: { sku: Sku }) => {
      this.sku = data.sku;
    });
    this.loading = false;
  }

  create(sku: Sku) {
    this.loading = true;
    this.skuService.create(sku, true)
      .then(sku => {
        Notification.success('Criado com sucesso!');
        this.router.navigate(['/sku']);
      })
      .catch(error => {
        this.loading = false;
      });
  }
}
