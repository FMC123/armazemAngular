import { LayoutComponent } from '../../layout/layout.component';
import { AuthGuard } from '../../auth/auth.guard';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import {EquipamentDestinationFormComponent} from "./equipament-destination-form/equipament-destination-form.component";
import {EquipamentDestinationFormResolve} from "./equipament-destination-form/equipament-destination-form-resolve.service";

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: 'equipament/:equipamentId/destinations',
        component: LayoutComponent,
        canActivateChild: [AuthGuard],
        children: [
          {
            path: 'new',
            component: EquipamentDestinationFormComponent,
            resolve: {
              equipamentDestination: EquipamentDestinationFormResolve
            }
          },
          {
            path: 'edit/:id',
            component: EquipamentDestinationFormComponent,
            resolve: {
              equipamentDestination: EquipamentDestinationFormResolve
            }
          },
        ]
      }
    ])
  ],
  providers: [
    EquipamentDestinationFormResolve,
  ],
  exports: [
    RouterModule
  ]
})
export class EquipamentDestinationRoutingModule { }
