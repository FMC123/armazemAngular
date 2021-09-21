import { Component, OnInit } from '@angular/core';
import {Retention} from "../retention";
import {ActivatedRoute, Router} from "@angular/router";
import {RetentionService} from "../retention.service";
import {DateTimeHelper, NumberHelper} from "../../shared/globalization";
import {RetentionBatch} from "../retention-batch";

@Component({
  selector: 'app-warrant-control-detail-info',
  templateUrl: './warrant-control-detail-info.component.html',
})
export class WarrantControlDetailInfoComponent implements OnInit {

  loading:boolean = false;
  sub:any;
  id:string;

  retention:Retention;
  retentionBatches:RetentionBatch[] = [];

  constructor(private router:Router,private  retentionService:RetentionService,private activatedRoute:ActivatedRoute) { }

  ngOnInit() {
      this.retention = new Retention();
      let params;
    this.sub = this.activatedRoute.params.subscribe(data => params = data);

    this.id = params.id || null;
    if(this.id){
      this.retentionService.find(this.id).then(res=>{
        this.retention = res;
        this.retentionBatches = res.retentionBatches;
      })
    }

  }

  handleGoBack(){
    this.router.navigate(["warrant-control",this.retention.client.id])
  }

}
