import { HarvestSeason } from './harvest-season';
import {
    HarvestSeasonDetailsResolve
} from './harvest-season-list-details/harvest-season-list-details-resolve.service';
import { NgModule }     from '@angular/core';
import { RouterModule } from '@angular/router';


import { HarvestSeasonFormResolve} from './harvest-season-form/harvest-season-form-resolve.service';
import { HarvestSeasonListComponent} from './harvest-season-list/harvest-season-list.component';
import { HarvestSeasonFormComponent} from './harvest-season-form/harvest-season-form.component';
import { HarvestSeasonDetailsComponent} from './harvest-season-list-details/harvest-season-list-details.component';
import { AuthGuard } from '../auth/auth.guard';
import { LayoutComponent } from "app/layout/layout.component";

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: 'harvest-season',
        component: LayoutComponent,
        canActivateChild: [ AuthGuard ],
        children: [
          {
            path: 'new',
            component: HarvestSeasonFormComponent,
            resolve: {
              harvestSeason: HarvestSeasonFormResolve
            }
          },
          {
            path: 'edit/:id',
            component: HarvestSeasonFormComponent,
            resolve: {
              harvestSeason: HarvestSeasonFormResolve
            }
          },
          {
            path: ':id',
            component: HarvestSeasonDetailsComponent,
            resolve: {
              harvestSeason: HarvestSeasonDetailsResolve,
            }
          },

          {
            path: '',
            component: HarvestSeasonListComponent
          }
        ]
      }
    ])
  ],
  providers: [
    HarvestSeasonFormResolve,
    HarvestSeasonDetailsResolve,
  ],
  exports: [
    RouterModule
  ]
})
export  class HarvestSeasonRoutingModule { }
