import { Cultivation } from './cultivation';
import {
    CultivationDetailsResolve
} from './cultivation-list-details/cultivation-list-details-resolve.service';
import { NgModule }     from '@angular/core';
import { RouterModule } from '@angular/router';


import { CultivationFormResolve} from './cultivation-form/cultivation-form-resolve.service';
import { CultivationListComponent} from './cultivation-list/cultivation-list.component';
import { CultivationFormComponent} from './cultivation-form/cultivation-form.component';
import { CultivationDetailsComponent} from './cultivation-list-details/cultivation-list-details.component';
import { AuthGuard } from '../auth/auth.guard';
import { LayoutComponent } from "app/layout/layout.component";

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: 'cultivation',
        component: LayoutComponent,
        canActivateChild: [ AuthGuard ],
        children: [
          {
            path: 'new',
            component: CultivationFormComponent,
            resolve: {
              cultivation: CultivationFormResolve
            }
          },
          {
            path: 'edit/:id',
            component: CultivationFormComponent,
            resolve: {
              cultivation: CultivationFormResolve
            }
          },
          {
            path: ':id',
            component: CultivationDetailsComponent,
            resolve: {
              cultivation: CultivationDetailsResolve,
            }
          },

          {
            path: '',
            component: CultivationListComponent
          }
        ]
      }
    ])
  ],
  providers: [
    CultivationFormResolve,
    CultivationDetailsResolve,
  ],
  exports: [
    RouterModule
  ]
})
export  class CultivationRoutingModule { }
