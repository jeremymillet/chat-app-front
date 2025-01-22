import { Component, Input } from '@angular/core';
import { MessageListComponent } from '../message-list/message-list.component';
import { Conversation, Friend, postMessage, User } from '../../types/types';
import { Observable } from 'rxjs';
import { CommonModule } from '@angular/common';
import { FormValidatorsService } from '../../utils/utils';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { messagesService } from '../../services/messagesServices';
import { AuthService } from '../../services/authServices';

@Component({
  selector: 'app-conversation',
  imports: [MessageListComponent,CommonModule,ReactiveFormsModule],
  templateUrl: './conversation.component.html',
  styleUrl: './conversation.component.scss'
})
export class ConversationComponent {
  @Input() friend!: Friend | null;
  @Input() conversation!: Conversation | null
  @Input() user!: User | null
  token$!: Observable<string | null>
  
  validateForm: any;
  
  constructor(private fb: NonNullableFormBuilder, private formValidators: FormValidatorsService,private messageService: messagesService,private authService: AuthService)
  {
    this.token$ = this.authService.token$;
    this.validateForm = this.fb.group({
      message: this.fb.control('', [Validators.required, Validators.minLength(1)]),
    });
  }
  submitMessage() {
    if (this.conversation && this.user) { // Vérifiez que `conversation` et `user` ne sont pas null
      const postMessage: postMessage = {
        conversationId: this.conversation.conversationId,
        senderId: this.user.id,
        content: this.validateForm.value.message
      };
      this.token$.subscribe((token) => {
        if (token) {
          this.messageService.postMessages(token, postMessage).subscribe({
            next: (response) => {
              console.log('message envoyé');
              this.validateForm.reset();
            },
            error: (err) => {
              console.error('Erreur lors de la connexion', err);
            },
          });
        } else {
          console.error('Token non disponible');
        }
      })
    }
  }
}
