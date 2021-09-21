import { Component, OnInit,OnDestroy } from '@angular/core';
import {Page} from "../../shared/page/page";
import {RouterHelperService} from "../../shared/router-helper/router-helper.service";
import {Router} from "@angular/router";
import {RetentionGroup} from "../retention-group";
import {RetentionService} from "../retention.service";
import {ErrorHandler} from "../../shared/errors/error-handler";

@Component({
  selector: 'app-warrant-control-list',
  templateUrl: './warrant-control-list.component.html',
})
export class WarrantControlListComponent implements OnInit,OnDestroy {

  loading:boolean = false;
  page:Page<RetentionGroup> = new Page<RetentionGroup>();

  constructor(private router:Router,
              private routerHelper:RouterHelperService,
              private retentionService:RetentionService,
              private errorHandler:ErrorHandler,
  ) { }

  ngOnInit() {
    this.loading = true;
    this.loadList();
    this.page.changeQuery.subscribe(()=>{
      this.loadList();
    })
  }

  ngOnDestroy() {
    this.page.changeQuery.unsubscribe();
  }

  loadList(){
    this.retentionService.listRetentionGroupPaged(this.page).then(res=>{
      this.loading = false;
    }).catch(err=>{
      this.errorHandler.fromServer(err);
      this.loading = false;
    })
  }

  handleDetailsPage(id:string){
    this.routerHelper.addUrl(this.router);
    this.router.navigate(['warrant-control',id]);
  }

}
