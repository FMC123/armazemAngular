import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import {
  BatchOperationCertificatesResolve,
} from 'app/batch-operation/batch-operation-certificate/batch-operation-certificates-resolve.service';
import { LayoutComponent } from 'app/layout/layout.component';

import { BatchPositionResolve } from '../../batch/batch-position/batch-position-resolve.service';
import { MarkupGroupsResolve } from '../../markup-group/markup-groups-resolve.service';
import { MapPositionResolve } from '../map-position/map-position-resolve.service';
import { MapRealtimeComponent } from './map-realtime.component';
import { MapRealtimeResolve } from './map-realtime.resolve';
import {ClassificationVersionAllResolveService} from "../../classification/classification-version-all-resolve.service";

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: 'map-realtime',
        component: LayoutComponent,
        children: [
          {
            path: '',
            component: MapRealtimeComponent,
            resolve: {
              layers: MapPositionResolve,
              storageUnits: MapRealtimeResolve,
              batchOperationCertificates: BatchOperationCertificatesResolve,
              markupGroups: MarkupGroupsResolve,
              batchPositions: BatchPositionResolve,
              classifications: ClassificationVersionAllResolveService,
            }
          }
        ],
      }
    ])
  ],
  providers: [
    MapRealtimeResolve,
  ],
  exports: [
    RouterModule
  ]
})
export class MapRealtimeRoutingModule { }
