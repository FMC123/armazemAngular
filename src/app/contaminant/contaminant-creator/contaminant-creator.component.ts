import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {Notification} from '../../shared/notification';
import {Contaminant} from "../contaminant";
import {ContaminantService} from "../contaminant.service";
import {ErrorHandler} from "../../shared/shared.module";

@Component({
  selector: 'app-contaminant-creator',
  templateUrl: './contaminant-creator.component.html'
})
export class ContaminantCreatorComponent implements OnInit {
  loading: boolean;
  contaminant: Contaminant;

  constructor(private route: ActivatedRoute,
              private contaminantService: ContaminantService,
              private router: Router,
              private errorHandler: ErrorHandler) {
  }

  ngOnInit() {
    this.loading = true;
    Notification.clearErrors();
    this.route.data.forEach((data: { contaminant: Contaminant }) => {
      this.contaminant = data.contaminant;
    });
    this.loading = false;
  }

  create(contaminant: Contaminant) {
    this.loading = true;
    this.contaminantService.create(contaminant, true)
      .then(() => {
        Notification.success('Criado com sucesso!');
        this.router.navigate(['/contaminants']);
      })
      .catch(error => {
        this.loading = false;
      });
  }
}
