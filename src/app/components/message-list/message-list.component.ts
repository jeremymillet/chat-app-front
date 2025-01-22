import { ChangeDetectorRef, Component, Input, OnChanges, OnDestroy, OnInit, SimpleChanges } from '@angular/core';
import { MessageComponent } from '../message/message.component';
import { Conversation, Friend, Message, User } from '../../types/types';
import { catchError, combineLatest, Observable, of, Subscription, switchMap, tap } from 'rxjs';
import { AuthService } from '../../services/authServices';
import { messagesService } from '../../services/messagesServices';
import { CommonModule } from '@angular/common';
import { WebSocketService } from '../../services/webSocketServices';

@Component({
  selector: 'app-message-list',
  imports: [MessageComponent,CommonModule],
  templateUrl: './message-list.component.html',
  styleUrl: './message-list.component.scss'
})
export class MessageListComponent implements OnInit, OnDestroy {
  @Input() conversation!: Conversation | null;
  @Input() friend!: Friend | null;
  @Input() user!: User | null;
  private messageSubscription: Subscription | null = null;
  token$!: Observable<string | null>;
  messageList: Message[] = [];

  constructor(
    private authServices: AuthService,
    private messageService: messagesService,
    private webSocketService: WebSocketService,
    private cdr: ChangeDetectorRef // Injecter ChangeDetectorRef
  ) {
    this.token$ = this.authServices.token$;
  }

  ngOnInit(): void {
    if (this.user && this.conversation) {
      this.getMessages();
      this.webSocketService.subscribeToConversation(this.conversation.conversationId);

      this.messageSubscription = this.webSocketService.getMessages().subscribe(message => {
        console.log(message);
        if (message) {
          console.log(message);
          this.messageList.push(message); // Ajouter le message reçu à la liste des messages
          this.cdr.detectChanges(); // Notifier Angular de la mise à jour pour rafraîchir l'affichage
        }
      });
    }
  }

  ngOnDestroy(): void {
    if (this.messageSubscription) {
      this.messageSubscription.unsubscribe();
    }
    this.webSocketService.disconnect();
  }

  getMessages(): void {
    if (this.conversation && this.token$) {
      this.token$.subscribe(token => {
        if (token && this.conversation) {
          this.messageService.getMessages(this.conversation.conversationId, token).subscribe({
            next: (messages) => {
              this.messageList = messages;
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


