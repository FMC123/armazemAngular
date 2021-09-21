import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { LayoutComponent } from 'app/layout/layout.component';
import { MobileAppFormResolve } from 'app/mobile-apps/mobile-app-form/mobile-app-form-resolve.service';
import { MobileAppFormComponent } from 'app/mobile-apps/mobile-app-form/mobile-app-form.component';
import { MobileAppDetailsResolve } from 'app/mobile-apps/mobile-app-list-details/mobile-app-list-details-resolve.service';
import { MobileAppDetailsComponent } from 'app/mobile-apps/mobile-app-list-details/mobile-app-list-details.component';
import { MobileAppListComponent } from 'app/mobile-apps/mobile-app-list/mobile-app-list.component';


@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: 'mobile-app',
        component: LayoutComponent,
        children: [
          {
            path: 'new',
            component: MobileAppFormComponent,
            resolve: {
              mobileApp: MobileAppFormResolve
            }
          },
          {
            path: 'edit/:id',
            component: MobileAppFormComponent,
            resolve: {
              mobileApp: MobileAppFormResolve
            }
          },
          {
            path: ':id',
            component: MobileAppDetailsComponent,
            resolve: {
              mobileApp: MobileAppDetailsResolve,
            }
          },
          {
            path: '',
            component: MobileAppListComponent
          }
        ]
      }
    ])
  ],
  providers: [
    MobileAppFormResolve,
    MobileAppDetailsResolve
  ],
  exports: [
    RouterModule
  ]
})
export class MobileAppRoutingModule { }
