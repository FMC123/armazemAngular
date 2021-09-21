import { NgModule }     from '@angular/core';
import { RouterModule } from '@angular/router';

import { AuthGuard } from '../auth/auth.guard';
import { LayoutComponent } from '../layout/layout.component';
import {CollaboratorPropertyFormResolve} from "./collaborator-property-form/collaborator-property-form-resolve.service";
import {CollaboratorPropertyDetailsComponent} from "./cooperator-property-list-details/collaborator-property-list-details.component";
import {CollaboratorPropertyFormComponent} from "./collaborator-property-form/collaborator-property-form.component";
import {CollaboratorPropertyListComponent} from "./collaborator-property-list/collaborator-property-list.component";

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: 'collaborator-property',
        component: LayoutComponent,
        canActivateChild: [ AuthGuard ],
        children: [
          {
            path: 'new',
            component: CollaboratorPropertyFormComponent,
            resolve: {
              collaboratorProperty: CollaboratorPropertyFormResolve
            }
          },
          {
            path: 'edit/:id',
            component: CollaboratorPropertyFormComponent,
            resolve: {
              collaboratorProperty: CollaboratorPropertyFormResolve
            }
          },
          {
            path: ':id',
            component: CollaboratorPropertyDetailsComponent,
            resolve: {
              collaboratorProperty: CollaboratorPropertyFormResolve
            }
          },
          {
            path: '',
            component: CollaboratorPropertyListComponent
          }
        ]
      }
    ])
  ],
  providers: [
    CollaboratorPropertyFormResolve
  ],
  exports: [
    RouterModule
  ]
})
export class CollaboratorPropertyRoutingModule { }
