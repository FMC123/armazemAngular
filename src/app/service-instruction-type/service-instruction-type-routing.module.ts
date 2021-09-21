import { ServiceInstructionTypeDetailsResolve } from './service-instruction-type-details/service-instruction-type-details-resolve.service';
import { ServiceInstructionTypeDetailsComponent } from './service-instruction-type-details/service-instruction-type-details.component';
import { AuthGuard } from '../auth/auth.guard';
import { ServiceInstructionTypeFormResolve } from './service-instruction-type-form/service-instruction-type-form-resolve.service';
import { ServiceInstructionTypeFormComponent } from './service-instruction-type-form/service-instruction-type-form.component';
import { ServiceInstructionTypeListComponent } from './service-instruction-type-list/service-instruction-type-list.component';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { LayoutComponent } from '../layout/layout.component';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: 'service-instruction-type',
        component: LayoutComponent,
        canActivateChild: [AuthGuard],
        children: [
          {
            path: 'new',
            component: ServiceInstructionTypeFormComponent,
            resolve: {
              serviceInstructionType: ServiceInstructionTypeFormResolve
            }
          },
          {
            path: 'edit/:id',
            component: ServiceInstructionTypeFormComponent,
            resolve: {
              serviceInstructionType: ServiceInstructionTypeFormResolve
            }
          },
          {
            path: ':id',
            component: ServiceInstructionTypeDetailsComponent,
            resolve: {
              serviceInstructionType: ServiceInstructionTypeDetailsResolve,
            }
          },
          {
            path: '',
            component: ServiceInstructionTypeListComponent
          }
        ]
      }
    ])
  ],
  providers: [
    ServiceInstructionTypeFormResolve,
    ServiceInstructionTypeDetailsResolve,
  ],
  exports: [
    RouterModule
  ]
})
export class ServiceInstructionTypeRoutingModule { }
