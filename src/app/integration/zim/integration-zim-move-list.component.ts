import { CustomValidators } from '../../shared/forms/validators/custom-validators';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Logger } from '../../shared/logger/logger';
import { ErrorHandler } from '../../shared/errors/error-handler';
import { IntegrationZimMoveService } from './integration-zim-move.service';
import { Page } from '../../shared/page/page';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { IntegrationZimMove } from './integration-zim-move';
import { Notification } from '../../shared/notification/notification';
import { Masks } from '../../shared/forms/masks/masks';



@Component({
  selector: 'app-integration-list',
  templateUrl: './integration-zim-move-list.component.html'
})
export class IntegrationZimMoveListComponent implements OnInit, OnDestroy {
  loading: boolean;
  error: boolean;
  numeroLote = '';
  dateDe = '';
  dateAte = '';
  page: Page<IntegrationZimMove> = new Page<IntegrationZimMove>();
  pageRet: Page<IntegrationZimMove> = new Page<IntegrationZimMove>();
  form: FormGroup;

  dateMask: any = Masks.dateMask;

  constructor(
    private integrationService: IntegrationZimMoveService,
    private errorHandler: ErrorHandler,
    private logger: Logger,
    private formBuilder: FormBuilder
  ) { }

  ngOnInit() {
    this.buildForm();
    this.loadList();
    this.loadListReturn();

    this.page.changeQuery.subscribe(() => {
      this.loadList();
    });

    this.pageRet.changeQuery.subscribe(() => {
      this.loadListReturn();
    });

    /* this.search
       .subscribe(() => {
         this.loadList();
         this.loadListReturn();
       });
       */
  }

  buildForm() {
    this.form = this.formBuilder.group({
      'numeroLote': [''],
      'dateDe': [
        '',
        [CustomValidators.dateValidator()]
      ],
      'dateAte': [
        '',
        [CustomValidators.dateValidator()]
      ]
    });
  }

  reloadLog(log: IntegrationZimMove) {

    this.error = false;
    this.loading = true;
    this.integrationService.reloadLog(log).then((newLog) => {
      if (newLog) {

        let index = this.page.data.findIndex(i => i.id === newLog.id);
        if (index !== -1) {
          this.page.data.splice(index, 1, newLog);
        }
      }

      this.loading = false;
      Notification.success('Mensagem enviada com sucesso!');


    }).catch(error => this.handleError(error));

  }

  loadLists() {
    this.loadList();
    this.loadListReturn();
  }

  loadList() {
    this.error = false;
    this.loading = true;

    this.numeroLote = this.form.value.numeroLote;
    this.dateDe = this.form.value.dateDe;
    this.dateAte = this.form.value.dateAte;

    this.integrationService.listPaged(this.page, this.numeroLote, this.dateDe, this.dateAte).then(() => {
      this.loading = false;
    }).catch(error => this.handleError(error));
  }

  loadListReturn() {
    this.error = false;
    this.loading = true;

    this.numeroLote = this.form.value.numeroLote;
    this.dateDe = this.form.value.dateDe;
    this.dateAte = this.form.value.dateAte;

    this.integrationService.listPagedRet(this.pageRet, this.numeroLote, this.dateDe, this.dateAte).then(() => {
      this.loading = false;
    }).catch(error => this.handleError(error));
  }

  ngOnDestroy() {
    this.page.changeQuery.unsubscribe();
    this.pageRet.changeQuery.unsubscribe();

  }

  handleError(error) {
    this.error = true;
    this.loading = false;
    return this.errorHandler.fromServer(error);
  }
}
