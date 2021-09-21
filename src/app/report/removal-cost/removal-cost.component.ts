import { Component } from "@angular/core/src/metadata/directives";
import { OnInit } from "@angular/core/src/metadata/lifecycle_hooks";
import { MarkupGroup } from "../../markup-group/markup-group";
import { Transportation } from "../../transportation/transportation";
import { AuthService } from "../../auth/auth.service";
import { FormBuilder } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { ErrorHandler } from "../../shared/errors/error-handler";
import { BatchOperationService } from "../../batch-operation/batch-operation.service";
import { MarkupGroupService } from "../../markup-group/markup-group.service";
import { RemovalCostService } from "./removal-cost.service";
import { RemovalCost } from "./removal-cost";
const FileSaver = require('file-saver');

@Component({
  selector: 'removal-cost',
  templateUrl: './removal-cost.component.html'

})



export class RemovalCostComponent implements OnInit {
  loading: boolean = false;
  generating: boolean = false;
  generatingPdf: boolean = false;
  markupGroups: Array<MarkupGroup> = [];
  filteredArray: Array<MarkupGroup> = [];
  markupSelected: MarkupGroup;

  removalsCosts: Array<RemovalCost> = [];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private errorHandler: ErrorHandler,
    private auth: AuthService,
    private markupGroupService: MarkupGroupService,
    private removalCostService: RemovalCostService
  ) { }


  ngOnInit() {
    this.markupGroupService.sync(this.auth.accessToken.warehouse.id, null).then(markups => {
      this.markupGroups = markups || [];
      this.markupGroups.sort((a, b) => {
        if (a.label < b.label) return -1;
        else if (a.label > b.label) return 1;
        else return 0;
      });
    }).catch((error) => this.errorHandler.fromServer(error));
  }

  limpar() {
    this.generating = false;
    this.removalsCosts = [];
  }

  addToFiltered() {
    if (!this.markupSelected)
      return;

    this.filteredArray.push(this.markupSelected);

    const index: number = this.markupGroups.indexOf(this.markupSelected);
    if (index !== -1) {
      this.markupGroups.splice(index, 1);
    }

    this.markupSelected = null;
  }

  removeFromFiltered(markupGroup: MarkupGroup) {
    if (!markupGroup)
      return;

    this.markupGroups.push(markupGroup);
    this.markupGroups.sort((a, b) => {
      if (a.label < b.label) return -1;
      else if (a.label > b.label) return 1;
      else return 0;
    });

    const index: number = this.filteredArray.indexOf(markupGroup);
    if (index !== -1) {
      this.filteredArray.splice(index, 1);
    }
  }

  onSelectMArkupGroup(markupGroup: MarkupGroup) {
    this.markupSelected = markupGroup;
  }

  gerarMarkupGroupCost() {
    this.generating = true;
    this.removalCostService.calculateRemovalCostMarkupGroup(this.filteredArray).then(removalCostList => {
      this.generating = false;
      this.removalsCosts = removalCostList || [];
      this.removalsCosts.sort((a, b) => {
        if (a.markupGroupLabel < b.markupGroupLabel) return -1;
        else if (a.markupGroupLabel > b.markupGroupLabel) return 1;
        else return 0;
      });
    }).catch((error) => {
      this.generating = false;
      this.errorHandler.fromServer(error)
    });
  }

  downloadMarkupGroupCost() {
    this.generatingPdf = true;
    this.removalCostService.downloadRemovalCostMarkupGroup(this.filteredArray).then( value => this.generatingPdf = false).catch((error) => {
      this.generatingPdf = false;
      this.errorHandler.fromServer(error)
    });
  }

  downloadMarkupGroupCostCSV() {
    this.generatingPdf = true;

    this.removalCostService.downloadRemovalCostMarkupGroupCSV(this.filteredArray).then((removalCostList: Array<RemovalCost>) => {
      let csv = 'MARCADOR: ' + ';' + 'TIPO: ' + ';' + 'BAGS:' + ';' + 'MOV:' + ';' + 'FATOR DE REMOÇÃO: \n';
      removalCostList.forEach(values => {
        csv = csv + values.markupGroupLabel + ';' + values.type + ';' + values.numOfBags + ';' + values.numOfMoves + ';' + values.removalFactor + '\n';

      });
      FileSaver.saveAs(new Blob([csv], { type: "text/csv;charset=utf-8" }), 'RelatorioEsforcoDeRemocao.csv');
      this.loading = false;
    });
  }
}
