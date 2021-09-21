import {NgModule} from '@angular/core';
import {RouterModule} from '@angular/router';

import {ContaminantListComponent} from './contaminant-list/contaminant-list.component';
import {LayoutComponent} from "app/layout/layout.component";
import {ContaminantDetailsComponent} from "./contaminant-list-details/contaminant-list-details.component";
import {ContaminantResolve} from "./contaminant-resolve.service";
import {ContaminantEditComponent} from "./contaminant-edit/contaminant-edit.component";
import {ContaminantCreatorComponent} from "./contaminant-creator/contaminant-creator.component";

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: 'contaminants',
        component: LayoutComponent,
        children: [
          {
            path: 'new',
            component: ContaminantCreatorComponent,
            resolve: {
              contaminant: ContaminantResolve,
            }
          },
          {
            path: 'edit/:id',
            component: ContaminantEditComponent,
            resolve: {
              contaminant: ContaminantResolve,
            }
          },
          {
            path: ':id',
            component: ContaminantDetailsComponent,
            resolve: {
              contaminant: ContaminantResolve,
            }
          },
          {
            path: '',
            component: ContaminantListComponent,
            resolve: {
              contaminant: ContaminantResolve,
            }
          }
        ]
      }
    ])
  ],
  providers: [
    ContaminantResolve
  ],
  exports: [
    RouterModule
  ]
})
export class ContaminantRoutingModule {
}
