import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {Notification} from '../../shared/notification';
import {Sku} from "../sku";
import {SkuService} from "../sku.service";

@Component({
  selector: 'app-sku-edit',
  templateUrl: './sku-edit.component.html'
})
export class SkuEditComponent implements OnInit {
  loading: boolean;
  sku: Sku;

  constructor(private route: ActivatedRoute,
              private skuService: SkuService,
              private router: Router) {
  }

  ngOnInit() {
    this.loading = true;
    Notification.clearErrors();
    this.route.data.forEach((data: { sku: Sku }) => {
      this.sku = data.sku;
    });
    this.loading = false;
  }

  update(sku: Sku) {
    this.loading = true;
    this.skuService.update(sku)
      .then(sku => {
        Notification.success('Editado com sucesso!');
        this.router.navigate(['/sku']);
      })
      .catch(error => {
        this.loading = false;
      });
  }
}
