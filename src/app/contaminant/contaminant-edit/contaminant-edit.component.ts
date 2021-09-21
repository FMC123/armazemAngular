import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {Notification} from '../../shared/notification';
import {Contaminant} from "../contaminant";
import {ContaminantService} from "../contaminant.service";

@Component({
  selector: 'app-contaminant-edit',
  templateUrl: './contaminant-edit.component.html'
})
export class ContaminantEditComponent implements OnInit {
  loading: boolean;
  contaminant: Contaminant;

  constructor(private route: ActivatedRoute,
              private contaminantService: ContaminantService,
              private router: Router) {
  }

  ngOnInit() {
    this.loading = true;
    Notification.clearErrors();
    this.route.data.forEach((data: { contaminant: Contaminant }) => {
      this.contaminant = data.contaminant;
    });
    this.loading = false;
  }

  update(contaminant: Contaminant) {
    this.loading = true;
    this.contaminantService.update(contaminant)
      .then(() => {
        Notification.success('Editado com sucesso!');
        this.router.navigate(['/contaminants']);
      })
      .catch(error => {
        this.loading = false;
      });
  }
}
