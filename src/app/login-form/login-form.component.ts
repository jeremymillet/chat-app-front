import { Component } from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzCheckboxModule } from 'ng-zorro-antd/checkbox';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';

@Component({
  selector: 'app-login-form',
  imports: [ReactiveFormsModule, NzButtonModule, NzCheckboxModule, NzFormModule, NzInputModule],
  templateUrl: "./login-form.component.html",
  styleUrl: './login-form.component.scss'
})
export class LoginComponent {

  validateLoginForm: any;

  constructor(private fb: NonNullableFormBuilder) {
    this.validateLoginForm = this.fb.group({
    email: this.fb.control('', [Validators.required]),
    password: this.fb.control('', [Validators.required]),
  });
  }
 

  submitLoginForm(): void {
    console.log('submit', this.validateLoginForm.value);
  }

}
