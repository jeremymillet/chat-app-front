import { Component } from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzCheckboxModule } from 'ng-zorro-antd/checkbox';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { FormValidatorsService } from '../../utils/utils';
import { SignUpRequest } from '../../types/types';
import { AuthService } from '../../services/authServices';
import { Observable } from 'rxjs';
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-sign-up-form',
  imports: [ReactiveFormsModule,CommonModule, NzButtonModule, NzCheckboxModule, NzFormModule, NzInputModule,NzSpinModule],
  templateUrl: './sign-up-form.component.html',
  styleUrl: './sign-up-form.component.scss'
})
export class SignUpFormComponent {
  validateSignUpForm: any;
  isLoadingSignUp$!: Observable<boolean>;
  errorSignUp$!: Observable<string | null>;
  
  constructor(private fb: NonNullableFormBuilder, private formValidator: FormValidatorsService, private authService: AuthService,) {
    this.isLoadingSignUp$ = this.authService.isLoadingSignUp$; // Initialisation après le constructeur
    this.errorSignUp$ = this.authService.errorSignUp$;
    this.validateSignUpForm = this.fb.group({
    username: this.fb.control('',[Validators.required,Validators.minLength(3)]),
    email: this.fb.control('', [Validators.required, Validators.email]),
    password: this.fb.control('', [Validators.required, Validators.minLength(6)]),
  });
  }
  getEmailError(): string {
    return this.formValidator.getErrorMessage(this.validateSignUpForm.controls['email'], 'Email');
  }

  getPasswordError(): string {
    return this.formValidator.getErrorMessage(this.validateSignUpForm.controls['password'], 'Password');
  }
  getUsernameError(): string {
    return this.formValidator.getErrorMessage(this.validateSignUpForm.controls['username'], 'Username');
  }
  
  submitSignUpForm(): void {
    const signUpRequest: SignUpRequest = { email: this.validateSignUpForm.value.email, password: this.validateSignUpForm.value.password, username: this.validateSignUpForm.value.username}
    this.authService.postSignUp(signUpRequest).subscribe({
    next: (response) => {
        alert("Inscription réussie")
        this.validateSignUpForm.reset();
    },
    error: (err) => {
      console.error("Erreur lors de l'inscription", err);
    },
  });
  }
}
