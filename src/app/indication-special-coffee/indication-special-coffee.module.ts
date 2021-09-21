import { NgModule } from '@angular/core';
import { SharedModule } from './../shared/shared.module';
import { IndicationSpecialCoffeeFindComponent } from './indication-special-coffee-find/indication-special-coffee-find.component';
import { IndicationSpecialCoffeeRoutingModule } from './indication-special-coffee-rounting.module';
import { IndicationSpecialCoffeService } from './indication-special-coffee.service';
import { IndicationSpecialCoffeeSaveComponent } from './indication-special-coffee-save/indication-special-coffee-save.component';
import { ClassificationService } from '../classification/classification.service';
import { UserService } from '../user/user.service';
import { IndicationSpecialCoffeeDetailComponent } from './indication-special-coffee-detail/indication-special-coffee-detail.component';
import { IndicationSpecialCoffeeResolve } from './indication-special-coffee-resolve.service';
import { ServiceChargeSharedModule } from '../service-charge/service-charge-shared.module';
import { ClassificationItemFormComponent } from '../classification/classification-form/classification-item-form.component';
import { ClassificationModule } from '../classification/classification.module';
import { ClassificationFormComponent } from '../classification/classification-form/classification-form.component';

@NgModule({
    imports: [
        SharedModule,
        IndicationSpecialCoffeeRoutingModule,
        ClassificationModule,
    ],
    declarations: [
        IndicationSpecialCoffeeFindComponent,
        IndicationSpecialCoffeeSaveComponent,
        IndicationSpecialCoffeeDetailComponent,
    ],
    providers: [
        IndicationSpecialCoffeService,
        ClassificationService,
        UserService,
        IndicationSpecialCoffeeResolve,
    ],
})
export class IndicationSpecialCoffeeModule { }
