import { NgModule } from '@angular/core';
import { HttpModule } from '@angular/http';
import { BrowserModule } from '@angular/platform-browser';
import { IntegrationZimMoveModule } from './integration/zim/integration-zim-move.module';
import { MapHistoryModule } from './map/map-history/map-history.module';
import { MapRealtimeModule } from './map/map-realtime/map-realtime.module';
import { GlobalBatchesModule } from './report/global-batches/global-batches.module';
import { MobileAppModule } from './mobile-apps/mobile-app.module';
import { PermissionModule } from './permission/permission.module';
import { DailyEntryModule } from './report/daily-entry/daily-entry-module';
import { DuctCleanModule } from './report/duct-clean/duct-clean-module';
import { SaleSummaryModule } from './report/sale-summary/sale-summary.module';
import { StorageUnitMergeModule } from './storage-unit/merge/storage-unit-merge.module';
import { CookieModule } from 'ngx-cookie';
import { AccessTokenModule } from './access-token/access-token.module';
import { AddressModule } from './address/address.module';
import { AllocationTruckModule } from './allocation-truck/allocation-truck.module';
import { AppState } from './app-state.service';
import { App } from './app.component';
import { routing } from './app.routing';
import { AuthModule } from './auth/auth.module';
import { AutomationLogModule } from './automation-log/automation-log.module';
import { AutomationRouteModule } from './automation-route/automation-route-module';
import { AutomationSemaphoreModule } from './automation-semaphore/automation-semaphore.module';
import { BalanceModule } from './balance/balance.module';
import { BatchLogModule } from './batch-log/batch-log.module';
import { BatchOperationLogModule } from './batch-operation-log/batch-operation-log.module';
import { BatchOperationModule } from './batch-operation/batch-operation.module';
import { BatchReportModule } from './batch-report/batch-report.module';
import { BatchModule } from './batch/batch.module';
import { CarrierModule } from './carrier/carrier.module';
import { CertificateModule } from './certificate/certificate.module';
import { CityModule } from './city/city.module';
import { ClassificationAuthorizationModule } from './classification-authorization/classification-authorization.module';
import { ClassificationModule } from './classification/classification.module';
import { CompanyModule } from './company/company.module';
import { CollaboratorPropertyModule } from './collaborator-property/collaborator-property.module';
import { CollaboratorModule } from './collaborator/collaborator.module';
import { CountryModule } from './country/country.module';
import { CultivationModule } from './cultivation/cultivation.module';
import { HarvestSeasonModule } from './harvest-season/harvest-season.module';
import { CustomerContactModule } from './customer-contact/customer-contact.module';
import { CustomerInventoryModule } from './report/customer-invertory/customer-inventory-module'
import { DashboardModule } from './dashboard/dashboard.module';
import { DateSyncModule } from './date-sync/date-sync.module';
import { DepartmentModule } from './department/department.module';
import { DrinkModule } from './drink/drink.module';
import { DriverModule } from './driver/driver.module';
import { EconomicGroupModule } from './economic-group/economic-group.module';
import { EquipamentModule } from './equipament/equipament.module';
import { ErrorComponent } from './error/error.component';
import { FarmModule } from './farm/farm.module';
import { ForkliftModule } from './forklift/forklift.module';
import { FunctionLogModule } from './integration/base-integration/integration-log/integration-log.module';
import { ServiceItemModule } from './service-item/service-item.module';
import { LayoutComponent } from './layout/layout.component';
import { LobbyModule } from './lobby/lobby.module';
import { MapZoneManagerModule } from './map/map-zone-manager/map-zone-manager.module';
import { MarkupGroupModule } from './markup-group/markup-group.module';
import { MenuModule } from './menu/menu.module';
import { NotFoundComponent } from './not-found/not-found.component';
import { OperationTypeModule } from './operation-type/operation-type.module';
import { PackStockModule } from './pack-stock/pack-stock.module';
import { PackTypeModule } from './pack-type/pack-type.module';
import { ParameterModule } from './parameter/parameter.module';
import { PersonModule } from './person/person.module';
import { PhysicalStockModule } from './report/physical-stock/physical-stock.module';
import { PositionLayerModule } from './position-layer/position-layer.module';
import { PositionModule } from './position/position.module';
import { PurchaseForecastModule } from './purchase-forecast/purchase-forecast.module';
import { InconsistencyModule } from './report/inconsistency-stock/inconsistency-stock-module';
import { PrintTagModule } from './report/print-tag/print-tag.module';
import { RemovalCostModule } from './report/removal-cost/removal-cost-module';
import { SamplePackModule } from './sample-pack/sample-pack.module';
import { SampleModule } from './sample/sample.module';
import { ScaleModule } from './scale/scale.module';
import { ServiceGroupItemPriceModule } from './service-group-items-price/service-group-item-price.module';
import { ServiceGroupItemModule } from './service-group-items/service-group-item.module';
import { ServiceGroupModule } from './service-group/service-group.module';
import { ServiceInstructionModule } from './service-instruction/service-instruction.module';
import { SharedModule } from './shared/shared.module';
import { ShippingAuthorizationModule } from './shipping-authorization/shipping-authorization.module';
import { StackModule } from './stack/stack.module';
import { StorageUnitBatchLogModule } from './storage-unit-batch-log/storage-unit-batch-log.module';
import { StorageUnitModule } from './storage-unit/storage-unit.module';
import { StrainerModule } from './strainer/strainer.module';
import { TransportationModule } from './transportation/transportation.module';
import { UfModule } from './uf/uf.module';
import { UserAdministratorModule } from './user-administrator/user-administrator.module';
import { UserModule } from './user/user.module';
import { VehiclePlateModule } from './vehicle-plate/vehicle-plate.module';
import { WarehouseStakeholderModule } from './warehouse-stakeholder/warehouse-stakeholder.module';
import { WarehouseModule } from './warehouse/warehouse.module';
import { SampleTrackingModule } from './sample-tracking/sample-tracking.module';
import { IndicationSpecialCoffeeModule } from './indication-special-coffee/indication-special-coffee.module';
import { ServiceInstructionTypeModule } from './service-instruction-type/service-instruction-type.module';
import { ServiceRequestModule } from './service-request/service-request.module';
import { PurchaseProspectModule } from './purchase-prospect/purchase-prospect.module';
import { SamplePackAuthModule } from './sample-pack-receive/sample-pack.module';
import { IntegrationProcafeModule } from './integration/procafe/integration-procafe.module';
import { SampleArchiveModule } from './sample-archive/sample-archive.module';
import { ChargingGenerationModule } from './charging-generation/charging-generation.module';
import { ServiceInstructionReportModule } from './service-instruction/service-instruction-report/service-instruction-report.module';
import { ForecastEvictionReportModule } from './service-instruction/forecast-eviction-report/forecast-eviction-report.module';
import { SilosStockModule } from './silos-stock/silos-stock.module';
import { PurchaseOrderModule } from './purchase-order/purchase-order.module';
import { DailyMovementReportModule } from './report/daily-movement-report/daily-movement-report.module';
import { SkuModule } from "./sku/sku.module";
import { ClassificationStepModule } from "./classification-step/classification-step.module";
import { ContaminantModule } from "./contaminant/contaminant.module";
import { BatchSwapHistoryModule } from "./batch-swap-history/batch-swap-history.module";
import { IndicatedSpecialCoffeeModule } from "./indicated-special-coffee/indicated-special-coffee.module";
import { AnalyzeSpecialCoffeeModule } from "./analyze-special-coffee/analyze-special-coffee.module";
import { ClassifSpecialCoffeeModule } from "./report/classification-special-coffee/classif-special-coffee-module";
import { PowerBIModule } from "angular2-powerbi";
import { AuditInventoryReportModule } from "./report/audit-inventory-report/audit-inventory-report.module";
import { NewPurchaseOrderModalComponent } from './new-purchase-order-modal/new-purchase-order-modal.component';
import { ChecklistModule } from "./checklist/checklist.module";
import { IncidentModule } from "./incident/incident.module";
import { WarrantControlModule } from "./warrant-control/warrant-control.module";
import { IncidentMotiveModule } from './incident-motive/incident-motive.module';


@NgModule({
  imports: [
    FunctionLogModule,
    StorageUnitModule,
    DateSyncModule,
    AccessTokenModule,
    CollaboratorModule,
    BrowserModule,
    HttpModule,
    UserModule,
    WarehouseModule,
    CertificateModule,
    DashboardModule,
    DriverModule,
    VehiclePlateModule,
    PositionModule,
    AuthModule.forRoot(),
    MenuModule,
    SharedModule,
    BatchModule,
    PositionLayerModule,
    ServiceItemModule,
    CarrierModule,
    CustomerContactModule,
    CustomerInventoryModule,
    FarmModule,
    CultivationModule,
    HarvestSeasonModule,
    CollaboratorPropertyModule,
    AddressModule,
    StackModule,
    ForkliftModule,
    PackTypeModule,
    MapZoneManagerModule,
    ServiceGroupModule,
    ServiceGroupItemModule,
    ServiceGroupItemPriceModule,
    UfModule,
    CountryModule,
    CityModule,
    WarehouseStakeholderModule,
    PersonModule,
    OperationTypeModule,
    DrinkModule,
    CompanyModule,
    StrainerModule,
    EconomicGroupModule,
    TransportationModule,
    LobbyModule,
    BalanceModule,
    BatchOperationModule,
    ParameterModule,
    SamplePackModule,
    SamplePackAuthModule,
    PackStockModule,
    ScaleModule,
    PurchaseForecastModule,
    routing,
    UserAdministratorModule,
    BatchLogModule,
    StorageUnitBatchLogModule,
    BatchOperationLogModule,
    ShippingAuthorizationModule,
    EquipamentModule,
    AutomationLogModule,
    AllocationTruckModule,
    MarkupGroupModule,
    AutomationRouteModule,
    IntegrationZimMoveModule,
    PhysicalStockModule,
    GlobalBatchesModule,
    PermissionModule,
    BatchReportModule,
    MobileAppModule,
    DailyEntryModule,
    DuctCleanModule,
    SaleSummaryModule,
    StorageUnitMergeModule,
    MapRealtimeModule,
    MapHistoryModule,
    CookieModule.forRoot(),
    InconsistencyModule,
    PrintTagModule,
    RemovalCostModule,
    ClassificationModule,
    ClassificationAuthorizationModule,
    IndicatedSpecialCoffeeModule,
    AnalyzeSpecialCoffeeModule,
    AutomationSemaphoreModule,
    SampleModule,
    DepartmentModule,
    ServiceInstructionModule,
    ServiceInstructionReportModule,
    DepartmentModule,
    SampleTrackingModule,
    ServiceInstructionTypeModule,
    ServiceRequestModule,
    IndicationSpecialCoffeeModule,
    PurchaseProspectModule,
    IntegrationProcafeModule,
    SampleArchiveModule,
    ChargingGenerationModule,
    ForecastEvictionReportModule,
    SilosStockModule,
    PurchaseOrderModule,
    DailyMovementReportModule,
    AuditInventoryReportModule,
    SkuModule,
    ClassificationStepModule,
    ContaminantModule,
    DriverModule,
    BatchSwapHistoryModule,
    ClassifSpecialCoffeeModule,
    ChecklistModule,
    IncidentModule,
    WarrantControlModule,
    PowerBIModule.forRoot(),
    IncidentMotiveModule
  ],
  providers: [AppState],
  declarations: [LayoutComponent, ErrorComponent, NotFoundComponent, App],
  bootstrap: [App]
})
export class AppModule { }
