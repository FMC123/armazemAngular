import { LayoutComponent } from '../../layout/layout.component';
import { AuthGuard } from '../../auth/auth.guard';
import { EquipamentTagFormResolve } from './equipament-tag-form/equipament-tag-form-resolve.service';
import { EquipamentTagFormComponent } from './equipament-tag-form/equipament-tag-form.component';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: 'equipament/:equipamentId/tag',
        component: LayoutComponent,
        canActivateChild: [AuthGuard],
        children: [
          {
            path: 'new',
            component: EquipamentTagFormComponent,
            resolve: {
              equipamentTag: EquipamentTagFormResolve
            }
          },
          {
            path: 'edit/:id',
            component: EquipamentTagFormComponent,
            resolve: {
              equipamentTag: EquipamentTagFormResolve
            }
          },
        ]
      }
    ])
  ],
  providers: [
    EquipamentTagFormResolve,
  ],
  exports: [
    RouterModule
  ]
})
export class EquipamentTagRoutingModule { }
