import { Component, Input, OnInit } from '@angular/core';
import { MobileApp } from 'app/mobile-apps/mobile-app';

@Component({
  selector: 'app-mobile-app-list-info',
  templateUrl: './mobile-app-list-info.component.html'
})
export class MobileAppListInfoComponent implements OnInit {
  @Input() mobileApp: MobileApp;

  leftColumn: Array<any>;

  public ngOnInit(): void {
    this.leftColumn = [
      ['Nome do arquivo', this.mobileApp.filename],
      ['Versão do APK', this.mobileApp.mobileAppVersion],
      ['Versão mínima do WMS', this.mobileApp.minWmsVersion],
    ];
  }
}
