import { Component, EventEmitter, Input, Output } from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { FormValidatorsService } from '../../utils/utils';
import { CommonModule } from '@angular/common';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzFormModule } from 'ng-zorro-antd/form';
import { AuthService } from '../../services/authServices';
import { friendService } from '../../services/friendServices';
import { User } from '../../types/types';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-friend-request-modal',
  imports: [NzModalModule,ReactiveFormsModule,CommonModule,NzInputModule,NzFormModule],
  templateUrl: './friend-request-modal.component.html',
  styleUrl: './friend-request-modal.component.scss'
})
export class FriendRequestModalComponent {
  @Input() isVisible: boolean = false; // Initialiser la valeur avec une valeur par défaut
  @Output() closeModal: EventEmitter<void> = new EventEmitter<void>(); // Événement de fermeture

  user$!: Observable<User | null>;
  token$!: Observable<string | null>

  validateFriendForm: any;

  constructor(private fb: NonNullableFormBuilder, private formValidators: FormValidatorsService, private authService: AuthService, private friendServices: friendService) {
    this.token$ = this.authService.token$;
    this.user$ = this.authService.user$;
    this.validateFriendForm = this.fb.group({
      id: this.fb.control('', [Validators.required]),
    });
  }

  getIdError(): string {
    return this.formValidators.getErrorMessage(this.validateFriendForm.controls['id'], 'id');
  }
  handleOk(): void {
    this.user$.subscribe((user) => {
      this.token$.subscribe((token) => { 
        if (user && token) {
        this.friendServices.addFriend(user.id,this.validateFriendForm.value.id,token).subscribe({
          next: (response) => {
            console.log('request sent : ', response);
            alert('request sent');
            this.validateFriendForm.reset();
          },
          error: (err) => {
            console.error('Error sent request', err);
          },
        });
      }
       })
    });
    console.log('Button ok clicked!');
    this.closeModal.emit(); // Notifie le parent que le modal doit être fermé
  }

  handleCancel(): void {
    console.log('Button cancel clicked!');
    this.closeModal.emit(); // Notifie le parent que le modal doit être fermé
  }
}
