import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { MessageComponent } from '../message/message.component';
import { Conversation, Message, User } from '../../types/types';
import { catchError, combineLatest, Observable, of, switchMap, tap } from 'rxjs';
import { AuthService } from '../../services/authServices';
import { messagesService } from '../../services/messagesServices';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-message-list',
  imports: [MessageComponent,CommonModule],
  templateUrl: './message-list.component.html',
  styleUrl: './message-list.component.scss'
})
export class MessageListComponent implements OnInit{
  @Input() conversation!: Conversation | null;
  token$!: Observable<string | null>;
  messageList: Message[] = [];
  isLoading: boolean = true;

  constructor(
    private authServices: AuthService,
    private messageService: messagesService
  ) {
    this.token$ = this.authServices.token$;
  }

  ngOnInit(): void {
    this.getMessages();  // Appeler la méthode de récupération des messages dès l'initialisation du composant
  }

 getMessages(): void {
  // Vérifier si la conversation et token$ sont définis
  if (this.conversation && this.token$) {
    this.token$.subscribe(token => {
      if (token && this.conversation) {
        // Appeler la méthode getMessages avec le token (et la conversationId)
        this.messageService.getMessages(this.conversation.conversationId, token).subscribe({
          next: (messages) => {
            this.messageList = messages;  // Stocker les messages dans messageList
            this.isLoading = false;
            console.log('Messages récupérés :', this.messageList);
          },
          error: (err) => {
            console.error('Erreur lors de la récupération des messages:', err);
          }
        });
      }
    });
  }
  }
}
