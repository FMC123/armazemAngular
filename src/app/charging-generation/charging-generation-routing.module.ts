import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { LayoutComponent } from 'app/layout/layout.component';

import { AuthGuard } from '../auth/auth.guard';
import { ChargingGenerationComponent } from './charging-generation.component';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: 'charging-generation',
        component: LayoutComponent,
        canActivateChild: [ AuthGuard ],
        children: [
          {
            path: '',
            component: ChargingGenerationComponent
          },
        ]
      }
    ])
  ],
  providers: [
  ],
  exports: [
    RouterModule
  ]
})
export class ChargingGenerationRoutingModule { }
