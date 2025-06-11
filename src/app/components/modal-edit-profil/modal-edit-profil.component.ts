import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output, SimpleChanges } from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { Observable, take } from 'rxjs';
import { FormValidatorsService } from '../../utils/utils';
import { AuthService } from '../../services/authServices';
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { EditProfilePictureRequest, User, UserProfileEditRequest } from '../../types/types';
import { UserService } from '../../services/userServices';

@Component({
  selector: 'app-modal-edit-profil',
  imports: [NzModalModule, ReactiveFormsModule, CommonModule, NzInputModule, NzFormModule,NzSpinModule],
  templateUrl: './modal-edit-profil.component.html',
  styleUrl: './modal-edit-profil.component.scss'
})
export class ModalEditProfilComponent {
  @Input() isVisible: boolean = false;
  @Output() closeModal: EventEmitter<void> = new EventEmitter<void>(); // Événement de fermeture
  isLoadingEdit$!: Observable<boolean>;
  errorEdit$!: Observable<string | null>;
  token$!: Observable<string | null>;
  validateEditForm: any;
  user$!:Observable<User | null>;
  constructor(private fb: NonNullableFormBuilder, private formValidator: FormValidatorsService, private authService: AuthService,private userServices: UserService) {
    this.user$ = this.authService.user$;
    this.token$ = this.authService.accessToken$;
    this.isLoadingEdit$ = this.authService.isLoadingSignUp$; // Initialisation après le constructeur
    this.errorEdit$ = this.authService.errorSignUp$;
    this.validateEditForm = this.fb.group({
      username: this.fb.control('', [Validators.required, Validators.minLength(3)]),
      description: this.fb.control('', [Validators.minLength(0),Validators.maxLength(255)]),
      profilePicture: this.fb.control(File, []),
    });
  }
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['isVisible']?.currentValue === true) {
      this.user$.subscribe(user => {
        if (user) {
          this.validateEditForm.patchValue({
            username: user.username,
            description: user.description,
          });
        }
      });
    }
  }
  onFileChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      this.validateEditForm.patchValue({ profilePicture: file });
    }
  }
  handleOk(): void {
    this.closeModal.emit(); // Notifie le parent que le modal doit être fermé
  }

  handleCancel(): void {
    this.closeModal.emit(); // Notifie le parent que le modal doit être fermé
  }
  submitForm(): void {
    this.user$.pipe(take(1)).subscribe(user => {
      this.token$.subscribe(token => { 
        if (token) {
          if (!user) return;
      if (this.validateEditForm.get('profilePicture')?.value) {
        const formData = new FormData();
        formData.append('file', this.validateEditForm.value.profilePicture);
        this.userServices.editProfilePicture(user.id, formData, token).subscribe({
          next: () => {
            this.validateEditForm.reset();;
          }
        })
      }
      const editRequest: UserProfileEditRequest = {
        id: user.id,
        username: this.validateEditForm.value.username,
        description: this.validateEditForm.value.description,
      };
  
      this.userServices.editUserProfile(editRequest,token).subscribe({
        next: () => {
          this.validateEditForm.reset();
        },
        error: (err) => {
          console.error('Erreur lors de la modification du profil', err);
        }
      });
        }
        
      })
      
    });
  }
}

