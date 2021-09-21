import {SilosStockListComponent} from "./silos-stock-list/silos-stock-list.component";
import {AuthGuard} from "../auth/auth.guard";
import {LayoutComponent} from "../layout/layout.component";
import {RouterModule} from "@angular/router";
import {NgModule} from "@angular/core";
import {SilosLungSilosResolve} from "./silos-stock-list/silos-stock-lung-silos-list-resolve.service";
import {SilosStorageSilosResolveService} from "./silos-stock-list/silos-storage-silos-resolve.service";

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: 'silos-stock',
        component: LayoutComponent,
        canActivateChild: [ AuthGuard ],
        children: [
          {
            path: '',
            component: SilosStockListComponent,
            resolve: {
              lungSilos: SilosLungSilosResolve,
              storageSilos: SilosStorageSilosResolveService
            }
          },
        ]
      }
    ])
  ],
  providers: [
    SilosLungSilosResolve,
    SilosStorageSilosResolveService
  ],
  exports: [
    RouterModule
  ]
})
export class SilosStockRoutingModule {}
