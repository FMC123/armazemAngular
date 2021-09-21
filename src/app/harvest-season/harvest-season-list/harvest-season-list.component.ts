import { HarvestSeason } from '../harvest-season';
import { HarvestSeasonService } from '../harvest-season.service';
import { Component, OnInit, OnDestroy }      from '@angular/core';
import { Notification } from './../../shared/notification/notification';
import { ErrorHandler, ModalManager, Search } from '../../shared/shared.module';
import { Logger } from '../../shared/logger/logger';
import { Page } from '../../shared/page/page';

@Component({
  selector: 'harvest-season-list',
  templateUrl: './harvest-season-list.component.html'
})
export class HarvestSeasonListComponent implements OnInit, OnDestroy {
  loading: boolean;
  error: boolean;
  deleteConfirm: ModalManager = new ModalManager();

  page: Page<HarvestSeason> = new Page<HarvestSeason>();
  search: Search = new Search();

  constructor(private harvestSeasonService: HarvestSeasonService,
              private errorHandler: ErrorHandler,
              private logger: Logger) {}

  ngOnInit() {
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
    this.harvestSeasonService.listPaged(this.search.value, this.page).then(() => {
    this.loading = false;
    }).catch(error => this.handleError(error));
  }

  delete(id: string | number) {
    this.harvestSeasonService.delete(id).then(() => {
      Notification.success('excluído com sucesso!');
      this.loadList();
    }).catch(error => this.handleError(error));
  }

  ngOnDestroy() {
    this.page.changeQuery.unsubscribe();
    this.search.destroy();
  }

  handleError(error){
    this.error = true;
    this.loading = false;
    return this.errorHandler.fromServer(error);
  }
}
