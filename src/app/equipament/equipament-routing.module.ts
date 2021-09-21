import { LayoutComponent } from '../layout/layout.component';
import { EquipamentDetailsResolve } from './equipament-details/equipament-details-resolve.service';
import { EquipamentDetailsComponent } from './equipament-details/equipament-details.component';
import { AuthGuard } from '../auth/auth.guard';
import { EquipamentFormResolve } from './equipament-form/equipament-form-resolve.service';
import { EquipamentFormComponent } from './equipament-form/equipament-form.component';
import { EquipamentListComponent } from './equipament-list/equipament-list.component';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: 'equipament',
        component: LayoutComponent,
        canActivateChild: [ AuthGuard ],
        children: [
          {
            path: 'new',
            component: EquipamentFormComponent,
            resolve: {
              equipament: EquipamentFormResolve
            }
          },
          {
            path: 'edit/:id',
            component: EquipamentFormComponent,
            resolve: {
              equipament: EquipamentFormResolve
            }
          },
          {
            path: ':id',
            component: EquipamentDetailsComponent,
            resolve: {
              equipament: EquipamentDetailsResolve,
            }
          },
          {
            path: '',
            component: EquipamentListComponent
          }
        ]
      }
    ])
  ],
  providers: [
    EquipamentFormResolve,
    EquipamentDetailsResolve,
  ],
  exports: [
    RouterModule
  ]
})
export class EquipamentRoutingModule { }
