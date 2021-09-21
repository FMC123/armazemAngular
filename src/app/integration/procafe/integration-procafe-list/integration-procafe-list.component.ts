import {Component, OnInit} from "@angular/core";
import {IntegrationProcafeService} from "../integration-procafe.service";
import {ModalManager} from "../../../shared/modals/modal-manager";
import {Logger} from "../../../shared/logger/logger";
import {Search} from "../../../shared/search/search";
import {ActivatedRoute} from "@angular/router";
import {Page} from "../../../shared/page/page";
import {IntegrationLogFilter} from "../../base-integration/integration-log/integration-log.filter";
import {FunctionLogService} from "../../base-integration/integration-log/integration-log.service";
import {ErrorHandler} from "../../../shared/errors/error-handler";
import {AuthService} from "../../../auth/auth.service";
import {IntegrationLog} from "../../base-integration/integration-log/integration-log";
import {IntegrationProcafe} from "../integration-procafe";

@Component({
  selector: 'app-integration-procafe-selector',
  templateUrl: './integration-procafe-list.component.html',
  providers: [ IntegrationProcafeService ]

})

export class IntegrationProcafeListComponent implements OnInit {
  loading: boolean;
  search: Search = new Search();
  page: Page<IntegrationProcafe> = new Page<IntegrationProcafe>();
  type: string = null;
  filter: string = null;

  constructor(
    private integrationProcafeService: IntegrationProcafeService,
    private errorHandler: ErrorHandler,
    private logger: Logger,
    private auth: AuthService,
    private route: ActivatedRoute,
  ) {}

  ngOnInit(): void {
    this.loadList();
    this.page.changeQuery.subscribe(() => {
      this.loadList();
    });
    this.search
      .subscribe(() => {
        this.filter = this.search.value;
        this.loadList();
      });
  }

  loadList() {
    this.loading = true;
    return this.integrationProcafeService.listPaged(this.type, this.filter, this.page).then((page) => {
      this.page = page;
      this.loading = false;
    }).catch(error => this.handleError(error));
  }

  handleError(error) {
    this.loading = false;
    return this.errorHandler.fromServer(error);
  }
}
