import { NgModule } from '@angular/core';

import { LogModule } from '../log/log.module';
import { SharedModule } from './../shared/shared.module';
import { BatchPositionResolve } from './batch-position/batch-position-resolve.service';
import { BatchPositionService } from './batch-position/batch-position.service';
import { BatchService } from './batch.service';
import {BatchRoutingModule, routedComponents} from "./batch-routing.module";
import {BatchCertificateService} from "../batch-certificate/batch-certificate.service";

@NgModule({
  imports: [
    SharedModule,
    LogModule,
    BatchRoutingModule,
  ],
  declarations: [
    ...routedComponents,
  ],
  providers: [
    BatchService,
    BatchCertificateService,
    BatchPositionResolve,
    BatchPositionService,
  ]
})
export class BatchModule { }
