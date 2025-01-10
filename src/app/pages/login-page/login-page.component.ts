import { Component } from '@angular/core';
import { LoginComponent } from '../../components/login-form/login-form.component';
import { SignUpFormComponent } from '../../components/sign-up-form/sign-up-form.component';

@Component({
  selector: 'app-login-page',
  imports: [LoginComponent,SignUpFormComponent],
  templateUrl: './login-page.component.html',
  styleUrl: './login-page.component.scss'
})
export class LoginPageComponent {

}
