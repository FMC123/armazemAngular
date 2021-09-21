import { NgModule } from '@angular/core';

import { SharedModule } from './../shared/shared.module';
import { CompanyChildrenListComponent } from './company-form/company-children-list.component';
import { CompanyFormComponent } from './company-form/company-form.component';
import { CompanyDetailsComponent } from './company-list-details/company-list-details.component';
import { CompanyListInfoComponent } from './company-list-details/company-list-info.component';
import { CompanyListComponent } from './company-list/company-list.component';
import { CompanyRoutingModule } from './company-routing.module';
import { CompanyService } from './company.service';

@NgModule({
  imports: [
    SharedModule,
   CompanyRoutingModule,


  ],
  declarations: [
   CompanyChildrenListComponent,
   CompanyFormComponent,
   CompanyListComponent,
   CompanyListInfoComponent,
   CompanyDetailsComponent

  ],

  providers: [
    CompanyService,
  ]
})
export class CompanyModule { }
