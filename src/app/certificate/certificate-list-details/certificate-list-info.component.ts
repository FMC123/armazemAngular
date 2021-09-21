import { Certificate } from '../certificate';
import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-certificate-list-info',
  templateUrl: './certificate-list-info.component.html'
})
export class CertificateListInfoComponent implements OnInit {
  @Input() certificate: Certificate;

  leftColumn: Array<any>;

  public ngOnInit(): void {
    this.leftColumn = [
      ['Nome', this.certificate.name],
      ['Código no Pró Café', this.certificate.procafeCode],
      ['Nome do arquivo', this.certificate.filename],
    ];
  }
}
