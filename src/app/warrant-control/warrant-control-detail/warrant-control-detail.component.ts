import { Component, OnInit } from '@angular/core';
import {Masks} from "../../shared/forms/masks/masks";
import {ModalManager} from "../../shared/modals/modal-manager";
import {ActivatedRoute, Router} from "@angular/router";
import {RouterHelperService} from "../../shared/router-helper/router-helper.service";
import {WarrantData} from "../warrant-data";
import {WarehouseStakeholder} from "../../warehouse-stakeholder/warehouse-stakeholder";
import {OnDestroy} from "@angular/core/src/metadata/lifecycle_hooks";
import {RetentionService} from "../retention.service";
import {Retention} from "../retention";
import {DateTimeHelper} from "../../shared/globalization";
import {AuthService} from "../../auth/auth.service";
import {Notification} from "../../shared/notification";
import {ErrorHandler} from "../../shared/errors/error-handler";
import {Page} from "../../shared/page/page";
import {RetentionFilter} from "../retention-filter";


@Component({
  selector: 'app-warrant-control-detail',
  templateUrl: './warrant-control-detail.component.html',
})
export class WarrantControlDetailComponent implements OnInit,OnDestroy {
  loading: boolean = false;
  dateMask = Masks.dateMask;

  prorogationModal:ModalManager = new ModalManager();
  deleteConfirm:ModalManager = new ModalManager();
  currentDate:number = new Date().getTime();

  warrants:WarrantData[] = [];
  client: WarehouseStakeholder;
  clientName: string = "";
  filter:RetentionFilter;

  sub:any;
  id:string;

  retentions:Retention[] = [];

  page: Page<Retention> = new Page<Retention>();

  constructor(private router:Router,
              private routerHelper:RouterHelperService,
              private activatedRoute:ActivatedRoute,
              private auth:AuthService,
              private errorHandler:ErrorHandler,
              private retentionService:RetentionService) { }

  ngOnInit() {
    this.loading = true;
    let params;
    this.sub = this.activatedRoute.params.subscribe(data => params = data);

    this.id = params.id || null;

    if(this.id){
      this.loadList();
      this.page.changeQuery.subscribe(()=>{
        this.loadList();
      })
    }
  }

  loadList(){
    this.filter = new RetentionFilter();
    this.filter.clientId = this.id;

    this.retentionService.listPaged(this.filter,this.page).then(()=>{
      this.clientName = this.page && this.page.data && this.page.data.length > 0 ?
        this.page.data[0].client.label || "":"";
    })
    this.loading = false;
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
    this.page.changeQuery.unsubscribe();
  }

  handleProrogationOpen(id:string){
    this.prorogationModal.open(id);
  }

  handleWarrantEdit(id:string){
    this.routerHelper.addUrl(this.router);
    this.router.navigate(['warrant-control','edit',id]);
  }

  handleWarrantInfo(id:string){
    this.routerHelper.addUrl(this.router);
    this.router.navigate(['warrant-control','info',id]);
  }

  handleNewWarrant(){
    this.routerHelper.addUrl(this.router);
    this.router.navigate(['warrant-control','new',this.id]);
  }

  handleDeleteWarrant(id:string){
    this.retentionService.delete(id).then(()=>{
      Notification.success("Warrant excluído com sucesso!");
      if(this.page.totalItems === 1){
        this.router.navigate(['warrant-control']);
      } else {
        this.loadList();
      }
      }).catch(err=>this.errorHandler.fromServer(err));
  }

  handleWarrantReport(id:string){
    this.retentionService.warrantReport(id,'WA').then((b) => {
      if (b.size === 0) {
        Notification.error('Não foram encontradas informações para abrir o relatório!');
      } else {
        let urlReport = window.URL.createObjectURL(b);
        window.open(urlReport);
      }
      this.retentionService.warrantReport(id, 'CDA').then((b) => {
        if (b.size === 0) {
          Notification.error('Não foram encontradas informações para abrir o relatório!');
        } else {
          let urlReport = window.URL.createObjectURL(b);
          window.open(urlReport);
        }
      }).catch((err)=>this.errorHandler.fromServer(err));
    }).catch((err)=>this.errorHandler.fromServer(err));


  }

  extendExpiration(expirationDate:string){
    this.loading = true;
    const retention_id = this.prorogationModal.value;
    let retention:Retention;

    const retentionIndex = this.page.data.findIndex(item=>item.id === retention_id);
    if(retentionIndex >= 0){
      retention = this.page.data[retentionIndex];
      retention.warrantData.expiresExtension = DateTimeHelper.fromDDMMYYYY(expirationDate);
      this.retentionService.save(retention).then(()=>{
          this.loadList();
          Notification.success("Data prorrogada com sucesso!")
          this.loading = false;
        }).catch(err=> {
          this.loading = false;
          this.errorHandler.fromServer(err)
        });

    }

    this.loading = false;
  }

}
