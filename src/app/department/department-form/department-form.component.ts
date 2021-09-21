import {Component, OnInit} from "@angular/core";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {Department} from "../department";
import {ErrorHandler} from "../../shared/errors/error-handler";
import {ActivatedRoute, Router} from "@angular/router";
import {Notification} from "../../shared/notification/notification";
import {EconomicGroup} from "../../economic-group/economic-group";
import {EconomicGroupService} from "../../economic-group/economic-group.service";
import {DepartmentService} from "../department.service";

@Component({
  selector: 'department-form',
  templateUrl: './department-form.component.html'
})

export class DepartmentFormComponent implements OnInit {

  form: FormGroup;
  department: Department;
  loading: boolean = false;

  submitted: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private formBuilder: FormBuilder,
    private errorHandler: ErrorHandler,
    private departmentService: DepartmentService,
  ) {


  }

  ngOnInit(): void {
    Notification.clearErrors();
    this.route.data.forEach((data: {department: Department}) => {
      this.department = data.department;
      this.buildForm();
    });
  }

  buildForm() {
    this.form = this.formBuilder.group({
      'name': [this.department && this.department.name ?  this.department.name : '' , [Validators.required]],
    });
  }


  save(){
    this.submitted = true;

    Object.keys(this.form.controls).forEach((key) => {
      this.form.controls[key].markAsDirty();
    });

    if (!this.form.valid) {
      return;
    }
    this.loading = true;
    this.department.name = this.form.value.name;
    this.departmentService.save(this.department).then((department) => {
      Notification.success('salvo com sucesso!');
      this.router.navigate(['/department']);
    }).catch((error) => this.handleError(error));
  }


  handleError(error) {
    this.loading = false;
    return this.errorHandler.fromServer(error);
  }
}
