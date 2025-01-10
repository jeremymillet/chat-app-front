import { Injectable } from '@angular/core';
import { AbstractControl, ValidationErrors } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class FormValidatorsService {
  // Méthode pour retourner des messages d'erreur dynamiques
  getErrorMessage(control: AbstractControl | null, fieldName: string = 'Field'): string {
    if (!control) {
      return '';
    }

    if (control.hasError('required')) {
      return `${fieldName} is required`;
    }

    if (control.hasError('minlength')) {
      const requiredLength = control.errors?.['minlength']?.requiredLength;
      return `${fieldName} must be at least ${requiredLength} characters`;
    }

    if (control.hasError('email')) {
      return `Please enter a valid email`;
    }
    return '';
  }
}