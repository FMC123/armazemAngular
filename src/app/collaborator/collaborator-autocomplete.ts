import { ErrorHandler } from '../shared/errors/error-handler';
import { Autocomplete } from '../shared/forms/autocomplete/autocomplete';
import { CollaboratorService } from './collaborator.service';
import { Observable } from 'rxjs/Rx';
import { Person } from '../person/person';
import { Injectable } from '@angular/core';
import { Collaborator } from 'app/collaborator/collaborator';

export class CollaboratorAutocomplete extends Autocomplete {

  constructor(
    private collaboratorService: CollaboratorService,
    private errorHandler: ErrorHandler,
  ) {
    super('label', 10);
  }

  load(search: string) {
    return Observable.fromPromise(this.collaboratorService.listActive(search).catch((error) => this.errorHandler.fromServer(error)));
  }
}
