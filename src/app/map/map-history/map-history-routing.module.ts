import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import {
  BatchOperationCertificatesResolve,
} from 'app/batch-operation/batch-operation-certificate/batch-operation-certificates-resolve.service';
import { LayoutComponent } from 'app/layout/layout.component';

import { MarkupGroupsResolve } from '../../markup-group/markup-groups-resolve.service';
import { MapPositionResolve } from '../map-position/map-position-resolve.service';
import { MapHistoryResolve } from './map-history-resolve.service';
import { MapHistoryComponent } from './map-history.component';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: 'map-history',
        component: LayoutComponent,
        children: [
          {
            path: '',
            component: MapHistoryComponent,
            resolve: {
              history: MapHistoryResolve,
              layers: MapPositionResolve,
              markupGroups: MarkupGroupsResolve,
              batchOperationCertificates: BatchOperationCertificatesResolve,
            }
          }
        ],
      }
    ])
  ],
  providers: [
    MapHistoryResolve
  ],
  exports: [
    RouterModule
  ]
})
export class MapHistoryRoutingModule { }
