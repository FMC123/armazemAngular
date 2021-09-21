import { ParameterType } from '../parameter-type';
import { Component, OnInit, OnDestroy } from '@angular/core';

import { Notification } from './../../shared/notification/notification';
import { ErrorHandler, ModalManager, Search } from '../../shared/shared.module';
import { Logger } from '../../shared/logger/logger';
import { Page } from '../../shared/page/page';
import { ParameterService } from "../parameter.service";
import { Parameter } from "../parameter";

@Component({
  selector: 'parameter-list',
  templateUrl: './parameter-list.component.html'
})
export class ParameterListComponent implements OnInit, OnDestroy {
  loading: boolean;
  error: boolean;
  deleteConfirm: ModalManager = new ModalManager();

  page: Page<Parameter> = new Page<Parameter>();
  search: Search = new Search();
  types: Array<ParameterType> = [];
  changedParams: Map<string, string> = new Map<string, string>();

  constructor(private parameterService: ParameterService,
    private errorHandler: ErrorHandler,
    private logger: Logger) { }

  ngOnInit() {
    this.page.itemsPerPage = 100;

    this.parameterService.types().then((types: Array<ParameterType>) => {
      this.types = ParameterType.fromListData(types);
    });

    this.loadList();
    this.page.changeQuery.subscribe(() => {
      this.loadList();
    });
    this.search
      .subscribe(() => {
        this.loadList();
      });
  }

  loadList() {
    this.error = false;
    this.loading = true;
    this.parameterService.listPaged(this.search.value, this.page).then(() => {
      this.loading = false;
    }).catch(error => this.handleError(error));
  }

  parameterFromType(value: ParameterType) {
    if (!value) {
      return new Parameter();
    }

    let parameter = this.page.data.find(t => t.keys === value.code);

    if (!parameter) {
      let param = new Parameter();
      param.keys = value.code;
      return param;
    }

    return parameter;
  }

  delete(id: string | number) {
    this.parameterService.delete(id).then(() => {
      Notification.success('Parâmetro excluído com sucesso!');
      this.loadList();
    }).catch(error => this.handleError(error));
  }

  parameterChange(type: ParameterType, value: string) {
    this.changedParams.set(type.code, value);
  }

  parameterCancel(type: ParameterType) {
    this.changedParams.delete(type.code);
    type.blur = false;
  }

  save(type: ParameterType) {
    let parameter = this.parameterFromType(type);
    let value = this.changedParams.get(type.code);

    if (!parameter || !value) {
      Notification.error("Erro ao setar parâmetro.");
      return;
    }
    parameter.value = value;

    this.parameterService.save(parameter).then(parameter => {
      Notification.success('Parâmetro salvo!');
      type.blur = false;
      this.changedParams.delete(parameter.keys);
      this.parameterService.batchSwapExpocaccerTrigger();
      // recarrega lista para atulizar registro (se foi inserido)
      this.loadList();
    }
    ).catch(error => this.handleError(error));
  }

  descriptionOf(parameter: Parameter) {
    if (!parameter || !parameter.keys) {
      return null;
    }

    let type = this.types.find(t => t.code === parameter.keys);

    if (!type) {
      return null;
    }

    return type.description;
  }

  ngOnDestroy() {
    this.page.changeQuery.unsubscribe();
    this.search.destroy();
  }

  handleError(error) {
    this.error = true;
    this.loading = false;
    return this.errorHandler.fromServer(error);
  }
}
