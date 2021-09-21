import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ServiceInstructionListComponent } from './service-instruction-list/service-instruction-list.component';
import { LayoutComponent } from '../layout/layout.component';
import { AuthGuard } from '../auth/auth.guard';
import { ServiceInstructionDetailComponent } from './service-instruction-detail/service-instruction-detail.component';
import { ServiceInstructionFormComponent } from './service-instruction-form/service-instruction-form.component';
import { ServiceInstructionFormResolve } from './service-instruction-form/service-instruction-form-resolve.service';
import {ServiceInstructionService} from "./service-instruction.service";

const routes: Routes = [
  {
    path: 'service-instruction',
    component: LayoutComponent,
    canActivateChild: [AuthGuard],
    children: [
      {
        path: 'new',
        component: ServiceInstructionFormComponent,
        resolve: {
          serviceInstruction: ServiceInstructionFormResolve
        }
      },
      {
        path: 'edit/:id',
        component: ServiceInstructionFormComponent,
        resolve: {
          serviceInstruction: ServiceInstructionFormResolve
        }
      },
      {
        path: ':id',
        component: ServiceInstructionDetailComponent
      },
      {
        path: '',
        component: ServiceInstructionListComponent
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  providers: [ServiceInstructionFormResolve],
  exports: [RouterModule]
})
export class ServiceInstructionRoutingModule { }

export const routedComponents = [
  ServiceInstructionListComponent,
  ServiceInstructionFormComponent,
  ServiceInstructionDetailComponent
];
