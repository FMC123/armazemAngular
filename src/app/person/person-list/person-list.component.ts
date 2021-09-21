import { PersonMemoryService } from '../person-memory.service';
import { Person } from 'app/person/person';
import { Component, OnInit, OnDestroy }      from '@angular/core';
import { PersonService } from './../person.service';
import { Notification } from './../../shared/notification/notification';
import { ErrorHandler, ModalManager, Search } from '../../shared/shared.module';
import { Logger } from '../../shared/logger/logger';
import { Page } from '../../shared/page/page';


@Component({
  selector: 'app-person-list',
  templateUrl: 'person-list.component.html'
})

export class PersonListComponent implements OnInit, OnDestroy {
  loading = false;

  error: boolean;
  deleteConfirm: ModalManager = new ModalManager();
  idPersonExclude: string;
  page: Page<Person> = new Page<Person>();
  search: Search = new Search();

  constructor(
    private service: PersonMemoryService,
    private personService: PersonService,
    private errorHandler: ErrorHandler,
    private logger: Logger
  ) { }

  ngOnInit() {
    this.loadList();
    this.page.changeQuery.subscribe(() => {
      this.loadList();
    });
    this.search
        .subscribe(() => {
          this.loadList();
        });

  }

  loadList() {
    this.error = false;
    this.loading = true;
    this.personService.listPaged(this.search.value, this.page).then(() => {
      this.loading = false;
    }).catch(error => this.handleError(error));
  }

  list() {
    this.loading = true;
  }

  newPerson() {
    this.service.newPerson();
  }

  detailsPerson(event: Event, p: Person) {
    event.stopPropagation();
    this.service.findPerson(p.id).then((person: Person) => {
      this.service.detailsPerson(person);
    });
  }

  editPerson(event: Event, p: Person) {;
    event.stopPropagation();
    this.service.findPerson(p.id).then((person: Person) => {
      this.service.editPerson(person);
      p = person;
    });
  }

  select(person: Person) {
    this.service.select.emit(person.id);
  }

  openDeleteConfirm(event: Event, id: string) {
    event.stopPropagation();
    this.deleteConfirm.open(id);
  }

  delete(id: string | number) {
    this.personService.delete(id).then(() => {
      Notification.success('Pessoa excluída com sucesso!');
      this.loadList();
    }).catch(error => this.handleError(error));
  }

  ngOnDestroy() {
    this.page.changeQuery.unsubscribe();
    this.search.destroy();
  }

  handleError(error){
    this.error = true;
    this.loading = false;
    return this.errorHandler.fromServer(error);
  }
  isExclude(excludeEvent): void {
    excludeEvent.event.stopPropagation();
    if (excludeEvent.excluded) {
      this.delete(this.idPersonExclude);
    } else {
      this.idPersonExclude = '';
    }
  }

  excludeOption(event: Event, id: string): void {
    event.stopPropagation();
    this.idPersonExclude = id ;
  }

}
