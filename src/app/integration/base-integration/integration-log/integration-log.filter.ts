import { DateTimeHelper } from '../../../shared/globalization/index';
import { URLSearchParams } from '@angular/http';

export class IntegrationLogFilter {

  static fromListData(listData: Array<IntegrationLogFilter>): Array<IntegrationLogFilter> {
    return listData.map((data) => {
      return IntegrationLogFilter.fromData(data);
    });
  }

  static fromData(data: IntegrationLogFilter): IntegrationLogFilter {
    if (!data) return new this();
    let functionLogAxFilter = new this(
      data.integrationId,
      data.url,
      data.direction,
      data.integrationType,
      data.status,
      data.integrationContent,
      data.integrationResponse,
      data.integrated,
      data.initialCreatedDateString,
      data.finalCreatedDateString,
    );
    return functionLogAxFilter;
  }


  constructor(
    public integrationId?: string,
    public url?: string,
    public direction?: string,
    public integrationType?: string,
    public status?: string,
    public integrationContent?: string,
    public integrationResponse?: string,
    public integrated?: string,
    public initialCreatedDateString?: string,
    public finalCreatedDateString?: string
  ) { }

  get initialCreatedDate(): number{
    let initialDateCreate = DateTimeHelper.fromDDMMYYYY(this.initialCreatedDateString);
    let dataAtual = new Date();
    let monthLast  = dataAtual.getDate() + "/" + dataAtual.getMonth() + "/" + dataAtual.getFullYear(); 
    
    if(this.initialCreatedDateString == undefined){
      if(dataAtual.getMonth() == 0){
        monthLast  = dataAtual.getDate() + "/" + "12" + "/" + dataAtual.getFullYear(); 
      }
      return DateTimeHelper.fromDDMMYYYY(monthLast);
    }
    return initialDateCreate;
  }

  set initialCreatedDate(value: number) {
		this.initialCreatedDateString = DateTimeHelper.toDDMMYYYY(value);
	}

  get finalCreatedDate(): number{
    return DateTimeHelper.fromDDMMYYYY(this.finalCreatedDateString);
  }
  set finalCreatedDate(value: number){
    this.finalCreatedDateString = DateTimeHelper.toDDMMYYYY(value);
  }

  public toURLSearchParams(): URLSearchParams {
    let params: URLSearchParams = new URLSearchParams();

    if (this.integrationId) {
      params.set('integrationId', this.integrationId);
    }

    if (this.url) {
      params.set('url', this.url);
    }
    
    if (this.direction) {
      params.set('direction', this.direction);
    }
    
    if (this.integrationType) {
      params.set('integrationType', this.integrationType);
    }
    
    if (this.status) {
      params.set('status', this.status);
    }

    if (this.integrationContent) {
      params.set('integrationContent', this.integrationContent);
    }

    if (this.integrationResponse) {
      params.set('integrationResponse', this.integrationResponse);
    }

    
    params.set('integrated', this.integrated);
    

    if (this.initialCreatedDate) {
      params.set('initialCreatedDate', this.initialCreatedDate + '');
    }

    if (this.finalCreatedDate) {
      params.set('finalCreatedDate', this.finalCreatedDate + '');
    }

    return params;
  }
}
