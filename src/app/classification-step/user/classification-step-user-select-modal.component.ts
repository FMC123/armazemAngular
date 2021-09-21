import {Component, EventEmitter, OnInit, Output} from "@angular/core";
import {User} from "../../user/user";
import {UserService} from "../../user/user.service";
import {ErrorHandler} from "../../shared/errors/error-handler";
import {Logger} from "../../shared/logger/logger";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";

@Component({
  selector: 'classification-step-user-select-modal',
  templateUrl: './classification-step-user-select-modal.component.html'
})
export class ClassificationStepUserSelectModalComponent implements OnInit{
  @Output() onSelectUser: EventEmitter<User> = new EventEmitter<User>(false);

  usersList: Array<User> = [];
  selectedUser: string;
  form: FormGroup;
  loading: boolean;
  error: boolean;

  constructor(private formBuilder: FormBuilder,
              private errorHandler: ErrorHandler,
              private logger: Logger,
              private userService: UserService) {

  }

  ngOnInit(): void {
    this.loadList();
    this.buildForm();
  }

  loadList() {
    this.error = false;
    this.loading = true;
    this.userService.list().then(users => {
      this.usersList = users;
      this.loading = false;
    }).catch(error => this.handleError(error));
  }

  buildForm() {
    this.form = this.formBuilder.group({
      userId: [ this.selectedUser ? this.selectedUser : '' , Validators.required],
    });
  }

  submit() {
    Object.keys(this.form.controls).forEach((key) => {
      this.form.controls[key].markAsDirty();
    });

    if (!this.form.valid) {
      return;
    }

    this.onSelectUser.emit(this.form.value.userId);
    (<any>jQuery)('.modal').modal('hide');
  }

  handleError(error){
    this.error = true;
    this.loading = false;
    return this.errorHandler.fromServer(error);
  }
}
