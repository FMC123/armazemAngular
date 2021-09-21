import { environment } from 'environments/environment';

export class Endpoints {
  static warrantReport = `${environment.API_URL}api/report/warrant-report`
  static retentionUrl = `${environment.API_URL}api/retention`;
  static warehouseUrl = `${environment.API_URL}api/warehouse`;
  static warehouseParentCandidateUrl = `${
    environment.API_URL
    }api/parent-candidate-warehouse`;
  static integrationLogUrl = `${environment.API_URL}api/integration/log`;
  static accessAccessTokenUrl = `${environment.API_URL}api/access-token`;
  static certificateUrl = `${environment.API_URL}api/certificate`;
  static userUrl = `${environment.API_URL}api/user`;
  static userWarehouseUrl = `${environment.API_URL}api/user/warehouse`;
  static userAutocompleteUrl = `${environment.API_URL}api/user/autocomplete`;
  static scaleUrl = `${environment.API_URL}api/scale`;
  static userValidationLoginUrl = `${
    environment.API_URL
    }api/user/validation/login-existence`;
  static roleUrl: string = `${environment.API_URL}api/role`;
  static positionLayerURL = `${environment.API_URL}api/positionlayer`;
  static stackUrl = `${environment.API_URL}api/stack`;
  static forkliftUrl = `${environment.API_URL}api/forklift`;
  static fiscalNoteUrl = `${environment.API_URL}api/fiscal-note`;
  static storageUnitUpdateUrl(storageUnitId) {
    return `${environment.API_URL}api/storage-unit/${storageUnitId}/update`;
  }

  static collaboratorURL = `${environment.API_URL}api/collaborator`;
  static ItemURL = `${environment.API_URL}api/service-item`;
  static CarrierURL = `${environment.API_URL}api/carrier`;
  static DriverURL = `${environment.API_URL}api/driver`;
  static FarmURL = `${environment.API_URL}api/farm`;
  static CountryURL = `${environment.API_URL}api/country`;
  static CityURL = `${environment.API_URL}api/city`;
  static UfURL = `${environment.API_URL}api/uf`;
  static WarehouseStakeholderUrl = `${
    environment.API_URL
    }api/warehouse-stakeholder`;
  static WarehouseStakeholderCertificateUrl = `${environment.API_URL}api/stakeholder/certificate`;
  static PersonUrl = `${environment.API_URL}api/person`;
  static collaboratorPropertyUrl = `${
    environment.API_URL
    }api/collaborator-property`;

  static drinkURL = `${environment.API_URL}api/drink`;
  static cultivationURL = `${environment.API_URL}api/cultivation`;
  static harvestSeasonURL = `${environment.API_URL}api/harvest-season`;
  static strainerURL = `${environment.API_URL}api/strainer`;
  static economicGroupURL = `${environment.API_URL}api/economic-group`;
  static associateUrl = `${environment.API_URL}api/associate-integration`;
  static operatorCertificateUrl = `${environment.API_URL}api/certificate`;
  static driverUrl = `${environment.API_URL}api/driver`;
  static companyURL = `${environment.API_URL}api/company`;
  static farmUrl = `${environment.API_URL}api/farm`;
  static motiveUrl = `${environment.API_URL}api/incident_motive`;

  static permissionUrl = `${environment.API_URL}api/permission`;

  static addressUrl(warehouseStakeholder) {
    return `${
      environment.API_URL
      }api/warehouse-stakeholder/${warehouseStakeholder}/address`;
  }
  static customerContactUrl(warehouseStakeholder) {
    return `${
      environment.API_URL
      }api/warehouse-stakeholder/${warehouseStakeholder}/customerContact`;
  }

  static batchQtdReservedByType(batchId) {
    return `${environment.API_URL}api/batch/reserved/${batchId}`;
  }
  static batchFilterUrl = `${environment.API_URL}api/batch/filter`;
  static batchUpdateBatchCodeUrl = `${environment.API_URL}api/batch/update-batchcode`;
  static batchSwapGetUrl = `${environment.API_URL}api/batch-swap/filterByBatch`;
  static batchWarehouseUrl = `${environment.API_URL}api/batch/warehouse`;
  static loadByFiscalNoteUrl = `${environment.API_URL}api/fiscal-note`;
  static batchOperationUrl = `${environment.API_URL}api/batch-operation`;
  static batchOperationCodeUrl = `${
    environment.API_URL
    }api/batch-operation-code`;
  static batchOperationCertificateUrl = `${
    environment.API_URL
    }api/batch-operation/certificate`;

  static batchCertificateUrl = `${
    environment.API_URL
  }api/batch/certificate`;

  static serviceGroupUrl = `${environment.API_URL}api/service-group`;

  static serviceGroupItemUrl(serviceGroupId) {
    return `${
      environment.API_URL
      }api/service-group/${serviceGroupId}/service-group-item`;
  }

  static serviceGroupItemPriceUrl(serviceGroupItemId) {
    return `${
      environment.API_URL
      }api/service-group-item/${serviceGroupItemId}/service-group-item-price`;
  }

  static serviceChargeURL = `${environment.API_URL}api/service-charge`;
  static serviceChargeRelAnalitico = `${environment.API_URL}api/report/service-charge-analytical-report`;
  static serviceChargeRelAnaliticoLista = `${environment.API_URL}api/report/service-charge-analytical-report-list`;
  static serviceChargeRelSintetico = `${environment.API_URL}api/report/service-charge-synthetic-report`;

  static batchOperationInitialWeighingUrl(batchOperationId) {
    return `${
      environment.API_URL
      }api/batch-operation/${batchOperationId}/initial-weighing`;
  }
  static batchOperationFinalWeighingUrl(batchOperationId) {
    return `${
      environment.API_URL
      }api/batch-operation/${batchOperationId}/final-weighing`;
  }
  static batchCodeUrl(batchOperationId) {
    return `${
      environment.API_URL
      }api/batch-operation/${batchOperationId}/batch-code`;
  }
  static batchUrl(batchOperationId) {
    return `${
      environment.API_URL
      }api/batch-operation/${batchOperationId}/batch`;
  }
  static batchInitialWeightUrl(batchOperationId) {
    return `${
      environment.API_URL
      }api/batch-operation/${batchOperationId}/batch-initial-weighing`;
  }
  static batchReceiveMoegaUrl(batchOperationId) {
    return `${
      environment.API_URL
      }api/batch-operation/${batchOperationId}/batch-receive-moega`;
  }
  static batchReceiveSiloUrl(batchOperationId) {
    return `${
      environment.API_URL
      }api/batch-operation/${batchOperationId}/batch-receive-silo`;
  }
  static batchFinalWeightUrl(batchOperationId) {
    return `${
      environment.API_URL
      }api/batch-operation/${batchOperationId}/batch-final-weighing`;
  }
  static batchNextToReceiveUrl(batchOperationId) {
    return `${
      environment.API_URL
      }api/batch-operation/${batchOperationId}/next-batch`;
  }
  static batchQuantityUrl(batchOperationId) {
    return `${
      environment.API_URL
      }api/batch-operation/${batchOperationId}/batch-quantity`;
  }
  static batchReopen(batchId){
    return `${environment.API_URL}api/batch/reopen/${batchId}`;
  }
  static vehiclePlateUrl = `${environment.API_URL}api/vehicle-plate`;
  static embegamentoUrl(batchOperationId) {
    return `${
      environment.API_URL
      }api/batch-operation/${batchOperationId}/batch-embegadora`;
  }
  static lastWeightUrl(batchOperationId) {
    return `${
      environment.API_URL
      }api/batch-operation/${batchOperationId}/last-weight`;
  }

  static batchOperationLogUrl(batchOperationId) {
    return `${environment.API_URL}api/batch-operation/${batchOperationId}/log`;
  }
  static batchLogUrl(batchOperationId) {
    return `${
      environment.API_URL
      }api/batch-operation/${batchOperationId}/batch-log`;
  }

  static logBatchUrl = `${environment.API_URL}api/batch-log`;

  static logBatchOperationUrl = `${
    environment.API_URL
    }api/batch-operation-log`;

  static batchWithPositionsUrl = `${
    environment.API_URL
    }api/batch-with-positions`;
  static batchReceiveFinishUrl(batchOperationId, batchId) {
    return `${
      environment.API_URL
      }api/batch-receive/${batchId}`;
  }
  static storageUnitLogUrl(batchId) {
    return `${environment.API_URL}api/storage-unit-log/${batchId}`;
  }
  static outStorageUnitLogUrl(outBatchId) {
    return `${environment.API_URL}api/out-storage-unit-log/${outBatchId}`;
  }

  static storageUnitUrl = `${environment.API_URL}api/storage-unit`;
  static storageUnitOutUrl = `${environment.API_URL}api/storage-unit-out`;
  static markupGroupUrl = `${environment.API_URL}api/markup-group`;


  static physicalStockCollaborator = `${
    environment.API_URL
    }api/report/physical-stock-collaborator`;

  static physicalStock = `${
    environment.API_URL
    }api/report/physical-stock-report`;
  static globalBagsReport = `${
    environment.API_URL
    }api/report/global-bags-report`;

  static globalBatchesReport = `${
    environment.API_URL
    }api/report/global-batches-report`;

  static storageUniBatchLogtUrl = `${
    environment.API_URL
    }api/storage-unit-batch-log`;

  static storageUniBatchLogReport = `${environment.API_URL}api/report/storage-unit-batch-log-report`;
  static documentEntryReport = `${environment.API_URL}api/report/document-entry-report`;
  static documentEntryTransportationReport = `${environment.API_URL}api/report/document-entry-transportation-report`;
  static documentExitReport = `${environment.API_URL}api/report/document-exit-report`;
  static documentExitTransportationReport = `${environment.API_URL}api/report/document-exit-transportation-report`;
  static documentEntryWeightReport = `${environment.API_URL}api/report/document-entry-weight-report`;
  static customerInventoryReport = `${environment.API_URL}api/report/customer-inventory-report`;
  static customerInventoryReportList = `${environment.API_URL}api/report/customer-inventory-report-list`;
  static storageUniBatchLogListReport = `${environment.API_URL}api/report/storage-unit-batch-log-report-list`;
  static sampleTrackingBatchesReport = `${environment.API_URL}api/report/sample-tracking-batches-report`;
  static internalOutputControl = `${environment.API_URL}api/report/internal-output-control`;

  static auditInventoryReportCsv = `${environment.API_URL}api/report/audit-inventory-report-csv`;

  static checklisttypelist: string = `${environment.API_URL}api/checklist/type/list`;

  static positionsUrl(warehouseId) {
    return `${environment.API_URL}api/warehouse/${warehouseId}/position`;
  }

  static batchRealtimeUrl(warehouseId) {
    return `${environment.API_URL}api/warehouse/${warehouseId}/batch`;
  }

  static mapRealtimeSyncUrl(warehouseId) {
    return `${
      environment.API_URL
      }api/warehouse/${warehouseId}/storage-unit/sync`;
  }
  static mapPositionsUrl(warehouseId) {
    return `${environment.API_URL}api/warehouse/${warehouseId}/map-position`;
  }
  static mapRealtimeUrl(warehouseId) {
    return `${environment.API_URL}api/warehouse/${warehouseId}/storage-unit`;
  }
  static mapHistoryUrl(warehouseId) {
    return `${environment.API_URL}api/warehouse/${warehouseId}/map-history`;
  }

  static batchPositionUrl = `${environment.API_URL}api/batch-position`;
  static packTypeUrl = `${environment.API_URL}api/pack-type`;
  static operationTypeUrl = `${environment.API_URL}api/operation-type`;
  static packingUrl = `${environment.API_URL}api/packing`;
  static userWarehousesURL: string = `${
    environment.API_URL
    }api/user-warehouse`;
  static loggedUserURL: string = `${environment.API_URL}api/logged-user`;
  static userMenusURL: string = `${environment.API_URL}api/user-menu`;
  static userPasswordURL: string = `${environment.API_URL}api/password`;
  static loginUrl: string = `${environment.API_URL}api/public/login`;
  static certificateImageUrl = `${
    environment.API_URL
    }api/public/certificate-image`;
  static dateSyncUrl: string = `${environment.API_URL}api/public/date-sync`;
  static axGetMap: string = `${environment.API_URL}api/integration/ax/getMap`;
  static axPostMap: string = `${
    environment.API_URL
    }api/integration/ax/ChangeZone`;

  static transportationUrl: string = `${
    environment.API_URL
    }api/transportation`;
  static transportationFiscalNoteUrl = (transportationId: string) =>
    `${environment.API_URL}api/transportation/${transportationId}/fiscal-note`;
  static transportationFiscalNoteCertificateUrl = (
    transportationId: string,
    fiscalNoteId: string
  ) =>
    `${
    environment.API_URL
    }api/transportation/${transportationId}/fiscal-note/${fiscalNoteId}/certificate`;

  static reportShipmentDryHarborURL: string = `${
    environment.API_URL
    }api/report/shipment-dry-harbor`;
  static reportShipmentURL: string = `${
    environment.API_URL
    }api/report/shipment`;
  // static reportShipmentTruckLotAllocationURL: string = `${environment.API_URL}api/report/shipment-truck-lot-allocation`; cometado para poder fazer commit parcial do codigo
  static reportWaitListUrl: string = `${
    environment.API_URL
    }api/report/wait-list`;
  static reportInternControlUrl: string = `${
    environment.API_URL
    }api/report/intern-control`;
  static reportWeightTicketIndividualUrl: string = `${
    environment.API_URL
    }api/report/weight-ticket-individual`;
  static reportInputFormTicketUrl: string = `${
    environment.API_URL
    }api/report/input-form-ticket`;
  static reportWeightTicketGroupedUrl: string = `${
    environment.API_URL
    }api/report/weight-ticket-grouped`;
  static reportWeightTicketPackagingOnlyUrl: string = `${
    environment.API_URL
  }api/report/weight-ticket-packaging-only`;
  static reportWeightTicketGroupedOutUrl: string = `${
    environment.API_URL
    }api/report/weight-ticket-grouped-out`;
  static reportWeightTicketOutPackagingOnlyUrl: string = `${
    environment.API_URL
  }api/report/weight-ticket-out-packaging-only`;

  static scaleIntegrationUrl: string = `${
    environment.API_URL
    }api/scale-integration`;
  static parametersUrl: string = `${environment.API_URL}api/parameter`;
  static packStockMovementUrl: string = `${
    environment.API_URL
    }api/pack-stock-movement`;
  static packStockMovementGroupUrl: string = `${
    environment.API_URL
    }api/pack-stock-movement-group`;
  static purchaseForecastUrl: string = `${
    environment.API_URL
    }api/purchase-forecast`;
  static packStockOwnerUrl: string = `${
    environment.API_URL
    }api/pack-stock-owner`;
  static shippingAuthorizationUrl: string = `${
    environment.API_URL
    }api/shipping-authorization`;

  static batchStakeholderUrl: string = `${
    environment.API_URL
    }api/batch-stakeholder-active`;

  static allocationTruckUrl = `${environment.API_URL}api/allocation-truck`;
  static automationLogUrl = `${environment.API_URL}api/automation-log`;
  static equipamentUrl = `${environment.API_URL}api/equipament`;
  static equipamentTypeUrl = `${environment.API_URL}api/equipament-type`;
  static equipamentTypeFunctionUrl(equipamentTypeId: string) {
    return `${
      environment.API_URL
      }api/equipament-type/${equipamentTypeId}/function`;
  }
  static equipamentTagUrl(equipamentId: string) {
    return `${environment.API_URL}api/equipament/${equipamentId}/tag`;
  }

  static equipamentDestinationUrl = `${
    environment.API_URL
    }api/equipamentDestination`;
  static equipamentDestinationByOriginUrl(equipamentOriginId: string) {
    return `${
      environment.API_URL
      }api/equipamentDestination/${equipamentOriginId}/destinations`;
  }
  static automationRouteEquipamentTagUrl(
    positionOriginId: string,
    positionDestination: string
  ) {
    return `${
      environment.API_URL
      }api/automation-route-item/${positionOriginId}/${positionDestination}/tags`;
  }
  static automationRouteItemUrl = `${
    environment.API_URL
    }api/automation-route-item`;
  static automationRouteExecutingCommand() {
    return `${
      environment.API_URL
      }api/automation-route-item/execute-automation/`;
  }
  static automationRouteUpdateStatus(routeItemId: string) {
    return `${
      environment.API_URL
      }api/automation-route-item/${routeItemId}/status`;
  }
  static automationRouteUnLink(batchId: string) {
    return `${environment.API_URL}api/automation-route-item/${batchId}/unlink`;
  }

  static integrationUrl = `${environment.API_URL}api/integration`;
  static integrationUrlRet = `${environment.API_URL}api/integrationRet`;

  static batchOperationMoveUrlOnlyMove(batchOperationId, batchId, positionId) {
    return `${
      environment.API_URL
      }api/batch-operation/${batchOperationId}/batch/${batchId}/move-to/${positionId}/moveWeb`;
  }

  static batchOperationMoveUrl(batchOperationId, batchId, positionId) {
    return `${
      environment.API_URL
      }api/batch-operation/${batchOperationId}/batch/${batchId}/move-to/${positionId}`;
  }

  static moveMarkGroupBatch(batchOperationId, positionId) {
    return `${
      environment.API_URL
      }api/markup-group/batch/${batchOperationId}/move-to/${positionId}`;
  }

  static moveAllMarkGroupBatch(batchOperationId, positionId) {
    return `${
      environment.API_URL
      }api/markup-group/batch/by-batch-operarion/${batchOperationId}/move-to/${positionId}`;
  }

  static finishAllMarkGroupMatch(batchOperationId) {
    return `${
      environment.API_URL
      }api/markup-group/batch/by-batch-operarion/${batchOperationId}/close`;
  }

  static batchOperationFinallyMoveWeb(batchOperationId, batchId, positionId) {
    return `${
      environment.API_URL
      }api/batch-operation/${batchOperationId}/batch/${batchId}/move-to/${positionId}/finallyMoveWeb`;
  }

  static batchWarehouse(warehouseId) {
    return `${environment.API_URL}api/warehouse/${warehouseId}/batch`;
  }

  static mobileAppUrl = `${environment.API_URL}api/mobile-app`;

  static mobileAppDownloadUrl = `${
    environment.API_URL
    }api/public/mobile-app-download`;

  static dailyEntryReport = `${
    environment.API_URL
    }api/report/daily-entry-report`;
  static specialCoffeeReport = `${
    environment.API_URL
  }api/report/special-coffee-report`;
  static automationRouteDuctClean = `${
    environment.API_URL
    }api/automation-route-item/duct-clean`;
  static ductCleanReport = `${
    environment.API_URL
    }api/report/duct-clean-report`;
  static saleSummaryReport = `${
    environment.API_URL
    }api/report/sale-summary-report`;
  static inconsistencyStockReport = `${
    environment.API_URL
    }api/report/inconsistency-stock`;
  static inconsistencyStockReportCsv = `${
    environment.API_URL
    }api/report/inconsistency-stock-report`;

  static dailyEntryReportList = `${
    environment.API_URL
    }api/report/daily-entry-report-list`;

  static specialCoffeeReportList = `${
    environment.API_URL
  }api/report/special-coffee-report-list`;

  static printTagReport = `${environment.API_URL}api/report/print-tag`;

  static printTagReportWithBatches(tagCode) {
    return `${environment.API_URL}api/report/print-tag/${tagCode}`;
  }
  static nextTagCodeUrl = `${environment.API_URL}api/tag/next-tag`;
  static sampleTrackingUrl: string = `${environment.API_URL}api/sample-tracking`;
  static sampleTrackingAutocompleteUrl: string = `${environment.API_URL}api/sample-tracking/autocomplete`;

  static removalCostMarkupGroupReport = `${
    environment.API_URL
    }api/report/removal-cost/markup-group`;
  static removalCostBatchReport = `${
    environment.API_URL
    }api/report/removal-cost/batch`;
  static removalCostStorageUnitReport = `${
    environment.API_URL
    }api/report/removal-cost/storage-unit`;

  static samplePendingUrl: string = `${environment.API_URL}api/sample/pending`;
  static sampleUrl: string = `${environment.API_URL}api/sample`;
  static sampleAuthUrl: string = `${environment.API_URL}api/sample-auth`;

  static sampleHistoryUrl: string = `${environment.API_URL}api/sample/history`;

  static sampleMovementHistoryUrl: string = `${environment.API_URL}api/sample/movement-history`;

  static sampleMovementHistoryNotConcludeUrl: string = `${environment.API_URL}api/sample/movement-history-not-conclude`;

  static departmentUrl: string = `${environment.API_URL}api/department`;

  static samplePackUrl: string = `${environment.API_URL}api/sample-pack`;

  static reportProtocolSamplePackUrl: string = `${
    environment.API_URL
    }api/sample-pack/report/send-protocol`;

  static reportSamplePrintBarCodeUrl: string = `${environment.API_URL}api/sample/report/print-barcode`;
  static reportSamplePrintRibbonUrl: string = `${environment.API_URL}api/sample/report/print-ribbon`;
  static reportSamplePrintRibbonServiceInstructionUrl: string = `${environment.API_URL}api/sample/report/print-ribbon/service-instruction`;
  static reportSamplePrintRibbonBatchOperationUrl: string = `${environment.API_URL}api/sample/report/print-ribbon/batch-operation`;

  static classificationUrl = `${environment.API_URL}api/classification`;
  static classificationTypeUrl = `${environment.API_URL}api/classification-type`;
  static classificationVersionUrl = `${environment.API_URL}api/classification-version`;
  static ClassificationStepUrl = `${environment.API_URL}apiclassification-step`;
  static ClassificationStepGroupUrl = `${environment.API_URL}api/classification-step-group`;
  static ClassificationStepUserUrl = `${environment.API_URL}api/classification-step-user`;
  static aboutUrl = `${environment.API_URL}api/public/about`;
  static stockPanelUrl = `${environment.API_URL}api/stock-panel`;
  static summaryPanelUrl = `${environment.API_URL}api/summary-panel`;
  static lobbyPanelUrl = `${environment.API_URL}api/lobby-panel`;
  static automationSemaphoreUrl: string = `${environment.API_URL}api/automation-semaphore`;
  static batchPositionDetachUrl(batchId, positionId) {
    return `${environment.API_URL}api/batch/${batchId}/detach-from/${positionId}`;
  };

  static serviceInstructionTypeUrl = `${environment.API_URL}api/service-instruction-type`;
  static serviceInstructionUrl = `${environment.API_URL}api/service-instruction`;
  static serviceInstructionItemUrl = `${environment.API_URL}api/service-instruction-item`;
  static serviceInstructionReportUrl = `${environment.API_URL}api/report/service-instruction-report`;
  static industrializationFiscalNoteUrl = `${environment.API_URL}api/industrialization-fiscal-note`;
  static serviceInstructionIndustrializationReportUrl = `${environment.API_URL}api/report/industrialization-service-instruction-report`;
  static serviceInstructionProportionalEvictionUrl = `${environment.API_URL}api/proportional-eviction`;

  static forecastEvictionAnalyticalReportUrl = `${environment.API_URL}api/report/forecast-eviction-analytical-report`;
  static forecastEvictionSyntheticReportUrl = `${environment.API_URL}api/report/forecast-eviction-synthetic-report`;

  static serviceRequestUrl = `${environment.API_URL}api/service-request`;
  static indicationSpecialCoffeeUrl = `${environment.API_URL}api/indication-special-coffee`;

  static purchaseProspectUrl = `${environment.API_URL}api/purchase-prospect`;
  static recalculateBatchUrl(batchOperationId) {
    return `${
      environment.API_URL
      }api/batch-operation/${batchOperationId}/batch/recalculate`;
  }

  static integrationProcafeLogUrl = `${environment.API_URL}api/integration/procafe/log`;

  static reportFieldsInfoUrl = `${environment.API_URL}api/report-fields-info`;

  static purchaseOrderUrl = `${environment.API_URL}api/purchase-order`;

  static dailyMovementReportUrl = `${environment.API_URL}api/report/daily-movement`;

  static skuUrl = `${environment.API_URL}api/storage-keeping-unit`;

  static contaminantUrl = `${environment.API_URL}api/contaminant`;

  static ownershipTransferUrl: string = `${environment.API_URL}api/ownership-transfer/transfer`;
  static ownershipTransferByListUrl: string = `${environment.API_URL}api/ownership-transfer/transferByList`;

  static batchSwapUrl: string = `${environment.API_URL}api/batch-swap`;

  static markupGroupBatchFindAllByBatchIdUrl: string = `${environment.API_URL}api/markup-group-batch/find-all-by-batchId`;
  static markupGroupBatchReopen: string = `${environment.API_URL}api/markup-group-batch/reopen`;

  static sampleFindByBatchIdUrl: string = `${environment.API_URL}api/sample/find-by-batchId`;

  static incidentUrl = `${environment.API_URL}api/incident`;

  // UCOM

  static packingOutputOutUrl: string = `${environment.UCOM_URL}/packing-output/out`;
  static shippingAuthorizationWeighingCompletedUrl: string = `${environment.UCOM_URL}/shipping-authorization/weighing-completed`;
  static shippingAuthorizationInUrl: string = `${environment.UCOM_URL}/shipping-authorization/in`;

  static powerBI: string = `${environment.API_URL}api/integration/power-bi`;
}
