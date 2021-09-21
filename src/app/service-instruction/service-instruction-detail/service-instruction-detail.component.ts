import { Component, OnInit } from '@angular/core';
import { ServiceInstruction } from '../service-instruction';
import { ServiceInstructionService } from '../service-instruction.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-service-instruction-detail',
  templateUrl: 'service-instruction-detail.component.html'
})
export class ServiceInstructionDetailComponent implements OnInit {
  serviceInstruction: ServiceInstruction;

  constructor(
    private service: ServiceInstructionService,
    private route: ActivatedRoute
  ) { }

  ngOnInit() {
    this.service
      .find(this.route.snapshot.params['id'])
      .then(serviceInstruction => {
        this.serviceInstruction = serviceInstruction;
      });
  }

  get leftColumn() {
    if (!this.serviceInstruction) {
      return [];
    }

    let obj = [];

    if (this.serviceInstruction.serviceRequest != null) {
      obj.push(['Solicitação de atendimento', this.serviceInstruction.serviceRequest.code]);
    }

    obj.push(['Número', this.serviceInstruction.code]);
    obj.push(['Nome', this.serviceInstruction.name]);
    obj.push([
      'Cliente',
      (this.serviceInstruction.clientStakeholder && this.serviceInstruction.clientStakeholder.person)
        ? this.serviceInstruction.clientStakeholder.person.name
        : null
    ]);
    obj.push(['Data Abertura', this.serviceInstruction.openedDateString]);
    obj.push(['Data Fechamento', this.serviceInstruction.closedDateString]);
    obj.push(['Situação', this.serviceInstruction.statusObject
      ? this.serviceInstruction.statusObject.name
      : ''
    ]);
    obj.push(['Tipo', this.serviceInstruction.type
      ? this.serviceInstruction.type.name
      : '']);

    if (this.serviceInstruction.serviceRequest != null && this.serviceInstruction.serviceRequest.batchesNotRegisteredString != '') {
      obj.push(['Lotes não cadastrados', this.serviceInstruction.serviceRequest.batchesRegisteredString]);
    }

    return obj;
  }

  get rightColumn() {
    if (!this.serviceInstruction) {
      return [];
    }

    return [
      ['Local/Destino', this.serviceInstruction.destinationWarehouse
        ? this.serviceInstruction.destinationWarehouse.name
        : ''],
      ['Sacas Despejo',
        this.serviceInstruction.markupGroup ? this.serviceInstruction.markupGroup.totalDump : null
      ],
      ['Observação',
        this.serviceInstruction.observation ? this.serviceInstruction.observation : null
      ],
      ['Perda por sólidos (kg)',
        this.serviceInstruction.lossBySolid ? this.serviceInstruction.lossBySolidString : null
      ],
      ['Perda por pó (kg)',
        this.serviceInstruction.lossByDust ? this.serviceInstruction.lossByDustString : null
      ],
      ['Retirado para amostra (kg)',
        this.serviceInstruction.sampleWithdrawal ? this.serviceInstruction.sampleWithdrawalString : null
      ],
    ];
  }
}
