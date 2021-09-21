import { NgModule }     from '@angular/core';
import { RouterModule } from '@angular/router';
import { AuthGuard } from '../auth/auth.guard';

import {collaboratorFormResolve} from "./collaborator-form/collaborator-form-resolve.service";
import {CollaboratorListComponent} from "./collaborator-list/collaborator-list.component";
import {CollaboratorFormComponent} from "./collaborator-form/collaborator-form.component";
import {collaboratorDetailsComponent} from "./collaborator-list-details/collaborator-list-details.component";
import { LayoutComponent } from "app/layout/layout.component";


@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: 'collaborator',
        component: LayoutComponent,
        canActivateChild: [ AuthGuard ],
        children: [
          {
            path: 'new',
            component: CollaboratorFormComponent,
            resolve: {
              collaborator: collaboratorFormResolve
            }
          },
          {
            path: 'edit/:id',
            component: CollaboratorFormComponent,
            resolve: {
              collaborator: collaboratorFormResolve
            }
          },
          {
            path: ':id',
            component: collaboratorDetailsComponent,
            resolve: {
              collaborator: collaboratorFormResolve
            }
          },
          {
            path: '',
            component: CollaboratorListComponent
          }
        ]
      }
    ])
  ],
  providers: [
    collaboratorFormResolve

  ],
  exports: [
    RouterModule
  ]
})
export  class CollaboratorRoutingModule { }
