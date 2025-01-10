import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzCheckboxModule } from 'ng-zorro-antd/checkbox';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { FormValidatorsService } from '../../utils/utils';
import { LoginResquest } from '../../types/types';
import { AuthService } from '../../services/authServices';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';


@Component({
  selector: 'app-login-form',
  imports: [ReactiveFormsModule,CommonModule, NzButtonModule, NzCheckboxModule, NzFormModule, NzInputModule,NzSpinModule],
  templateUrl: "./login-form.component.html",
  styleUrl: './login-form.component.scss'
})
export class LoginComponent {
  isLoadingLogin$!: Observable<boolean>;
  errorLogin$!: Observable<string | null>;
  
  validateLoginForm: any;

  constructor(
    private fb: NonNullableFormBuilder,
    private formValidators: FormValidatorsService,
    private authService: AuthService,
    private router: Router// Assuming AuthService is injected here
  ) {
    this.isLoadingLogin$ = this.authService.isLoadingLogin$; // Initialisation après le constructeur
    this.errorLogin$ = this.authService.errorLogin$;
    this.validateLoginForm = this.fb.group({
      email: this.fb.control('', [Validators.required, Validators.email]),
      password: this.fb.control('', [Validators.required, Validators.minLength(6)])
    });
  }

  

  getEmailError(): string {
    return this.formValidators.getErrorMessage(this.validateLoginForm.controls['email'], 'Email');
  }

  getPasswordError(): string {
    return this.formValidators.getErrorMessage(this.validateLoginForm.controls['password'], 'Password');
  }
 
  submitLoginForm() {
    const loginRequest: LoginResquest = { email: this.validateLoginForm.value.email, password: this.validateLoginForm.value.password }
     this.authService.postLogin(loginRequest).subscribe({
    next: (response) => {
      console.log('Connexion réussie : ', response);
        this.authService.setToken(response.accessToken);
        this.router.navigateByUrl(`/home/${response.user.id}`);
         
    },
    error: (err) => {
      console.error('Erreur lors de la connexion', err);
    },
  });
  }

}