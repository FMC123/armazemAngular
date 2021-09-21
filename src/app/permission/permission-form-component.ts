import { Subscription } from 'rxjs/Rx';
import { WarehouseStakeholderService } from '../warehouse-stakeholder/warehouse-stakeholder.service';
import { WarehouseStakeholderAutocomplete } from '../warehouse-stakeholder/warehouse-stakeholder-autocomplete';
import { UserService } from '../user/user.service';
import { UserAutocomplete } from './user-autocomplete.component';
import { ModalManager } from '../shared/modals/modal-manager';
import { ErrorHandler } from '../shared/errors/error-handler';
import { PermissionService } from './permission.service';

import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { DbGroup } from 'app/permission/dbGroup';
import { Notification } from './../shared/notification/notification';

@Component({
  selector: 'app-permission-form',
  templateUrl: './permission-form.component.html'
})
export class PermissionFormComponent implements OnInit, OnDestroy {

  group: DbGroup;
  form: FormGroup;
  loading: boolean = false;
  submitted: boolean = false;
  deleteConfirm: ModalManager = new ModalManager();
  userAutocomplete: UserAutocomplete;

  // ownerAutocomplete: WarehouseStakeholderAutocomplete;
  userSubscription: Subscription;

  get editing() {
    return !!this.group && !!this.group.id;
  }

  constructor(
    private route: ActivatedRoute,
    private userService: UserService,
    private router: Router,
    private formBuilder: FormBuilder,
    private permissionService: PermissionService,
    private warehouseStakeholderService: WarehouseStakeholderService,
    private errorHandler: ErrorHandler
  ) {



  }

  ngOnInit() {
    // this.ownerAutocomplete = new WarehouseStakeholderAutocomplete(this.warehouseStakeholderService, this.errorHandler);

    this.userAutocomplete = new UserAutocomplete(this.userService, this.errorHandler);



    Notification.clearErrors();
    this.route.data.forEach((data: { group: DbGroup }) => {
      this.group = data.group;
      this.buildForm();
    });

    if (!this.group) {
      console.log('Novo');
    }

  }

  buildForm() {
    this.form = this.formBuilder.group({
      'name': [this.group.name || '', Validators.required],
      'ownerStakeholderId': [''],
      'leader': [this.group.leader],
    });

    this.userAutocomplete.value = null;

    this.userSubscription = this.userAutocomplete.valueChange.subscribe((value) => {

      if (value) {
        const index = this.group.usuarios.findIndex(mg => mg.id === value.id);

        if (index === -1) {
          this.group.usuarios.push(value);
          console.log(value.id);
        }

      }

      this.userAutocomplete.clean();
    });

  }

  get valid() {
    return this.form.valid;
  }

  ngOnDestroy() {
    if (this.userSubscription != null && !this.userSubscription.closed) {
      this.userSubscription.unsubscribe();
    }
  }

  save() {
    this.submitted = true;

    if (!this.valid) {
      Notification.error('Todos os campos devem ser preenchidos');
      return;
    }
    this.loading = true;

    this.group.name = this.form.value.name;

    return this.permissionService.save(this.group).then(() => {
      Notification.success('Grupo salvo com sucesso!');
      this.router.navigate(['/permission']);
      this.loading = false;
    }).catch(e => {
      this.loading = false;
    });

  }

  handleError(error) {
    this.loading = false;
    return this.errorHandler.fromServer(error);
  }

  deleteUsuario(id: string) {

    console.log('id ' + id);

    const index = this.group.usuarios.findIndex(mg => mg.id === id);
    console.log('excluindo ' + index);
    if (index !== -1) {
      this.group.usuarios.splice(index, 1);
    }



  }

}
