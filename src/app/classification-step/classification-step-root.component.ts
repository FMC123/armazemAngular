import {Component, OnDestroy, OnInit} from "@angular/core";
import {ClassificationStepGroup} from "./group/classification-step-group";
import {ErrorHandler} from "../shared/errors/error-handler";
import {Logger} from "../shared/logger/logger";
import {ClassificationStepGroupService} from "./group/classification-step-group.service";
import {ModalManager} from "../shared/modals/modal-manager";
import {User} from "../user/user";
import {ClassificationStep} from "./classification-step";
import {ClassificationStepUser} from "./user/classification-step-user";
import {ClassificationStepUserService} from "./user/classification-step-user.service";
import {Notification} from "../shared/notification";

@Component({
  selector: 'app-classification-step-root',
  templateUrl: './classification-step-root.component.html'
})
export class ClassificationStepRootComponent implements OnInit, OnDestroy{

  loading: boolean;
  error: boolean;

  classGroupFilledArray: Array<ClassificationStepGroup> = [];

  classGroupButtons: boolean = false;
  classGroupStepButtons: boolean = false;
  classGroupStepTypeButtons: boolean = false;
  classGroupStepUserButtons: boolean = true;


  addEditGroupModal = new ModalManager();
  addEditStepModal = new ModalManager();
  addEditStepTypeModal = new ModalManager();
  addEditStepUserModal = new ModalManager();

  deleteGroupModal = new ModalManager();
  deleteStepModal = new ModalManager();
  deleteStepTypeModal = new ModalManager();
  deleteStepUserModal = new ModalManager();


  constructor(private errorHandler: ErrorHandler,
              private logger: Logger,
              private classificationStepGroupService: ClassificationStepGroupService,
              private classificationStepUserService: ClassificationStepUserService) {
  }

  ngOnInit(): void {
    this.loadList();
  }

  ngOnDestroy(): void {
  }

  loadList() {
    this.error = false;
    this.loading = true;
    this.classificationStepGroupService.listFilled().then(clasGroups => {
      this.classGroupFilledArray = clasGroups;
      this.loading = false;
    }).catch(error => this.handleError(error));
  }

  addClassStepUser(userId){
    if (!userId)
      return;

    this.loading = true;
    let classStep = this.addEditStepUserModal.value;
    let user = new User();
    user.id = userId;
    if(classStep && user){
      let clasStepUser = new ClassificationStepUser();
      clasStepUser.stepUser = user;
      clasStepUser.classificationStep = classStep;
      this.classificationStepUserService.save(clasStepUser).then(clasStepUserReturn =>{
        Notification.success('Usuário inserido com sucesso!');
        this.loadList();
      }).catch(error => this.handleError(error))
    }
    this.addEditStepUserModal.close()
  }

  deleteClasStepUser(classStepUser: ClassificationStepUser){
    this.loading = true;

    return this.classificationStepUserService.delete(classStepUser.id).then(() => {
      Notification.success('Usuário excluído com sucesso!');
      return this.loadList();
    }).catch(error => {
      this.handleError(error);
    });
  }

  handleError(error){
    this.error = true;
    this.loading = false;
    return this.errorHandler.fromServer(error);
  }

}
