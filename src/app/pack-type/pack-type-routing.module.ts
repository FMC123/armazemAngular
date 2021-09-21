import { PackTypeDetailsResolve } from './pack-type-details/pack-type-details-resolve.service';
import { PackTypeDetailsComponent } from './pack-type-details/pack-type-details.component';
import { AuthGuard } from '../auth/auth.guard';
import { PackTypeFormResolve } from './pack-type-form/pack-type-form-resolve.service';
import { PackTypeFormComponent } from './pack-type-form/pack-type-form.component';
import { PackTypeListComponent } from './pack-type-list/pack-type-list.component';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { LayoutComponent } from '../layout/layout.component';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: 'pack-type',
        component: LayoutComponent,
        canActivateChild: [ AuthGuard ],
        children: [
          {
            path: 'new',
            component: PackTypeFormComponent,
            resolve: {
              packType: PackTypeFormResolve
            }
          },
          {
            path: 'edit/:id',
            component: PackTypeFormComponent,
            resolve: {
              packType: PackTypeFormResolve
            }
          },
          {
            path: ':id',
            component: PackTypeDetailsComponent,
            resolve: {
              packType: PackTypeDetailsResolve,
            }
          },
          {
            path: '',
            component: PackTypeListComponent
          }
        ]
      }
    ])
  ],
  providers: [
    PackTypeFormResolve,
    PackTypeDetailsResolve,
  ],
  exports: [
    RouterModule
  ]
})
export class PackTypeRoutingModule { }
