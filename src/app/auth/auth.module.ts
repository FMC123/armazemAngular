import { environment } from '../../environments/environment';
import { NgModule, ModuleWithProviders } from '@angular/core';

import { LoginComponent }   from './login/login.component';
import { LoginFormComponent }   from './login/login-form.component';
import { PasswordFormComponent }   from './login/password-form.component';
import { WarehouseLoginComponent }   from './warehouse-login/warehouse-login.component';
import { PasswordChangeComponent } from './password/password-change.component';

import { SharedModule } from '../shared/shared.module';
import { AuthGuard } from './auth.guard';
import { AuthService } from './auth.service';

@NgModule({
  imports: [ SharedModule ],
  exports: [
    PasswordChangeComponent
  ],
  declarations: [
    LoginComponent,
    LoginFormComponent,
    PasswordFormComponent,
    WarehouseLoginComponent,
    PasswordChangeComponent
  ]
})
export class AuthModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: AuthModule,
      providers: [
        AuthService,
        AuthGuard,
      ]
    };
  }
}
