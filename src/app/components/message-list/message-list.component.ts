import { ChangeDetectorRef, Component, Input, OnChanges, OnDestroy, OnInit, SimpleChanges, 
  ViewChild, ElementRef, AfterViewChecked, 
  AfterViewInit} from '@angular/core';
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
export class MessageListComponent implements OnInit, OnChanges, OnDestroy,AfterViewChecked,AfterViewInit {
  @Input() conversation!: Conversation | null;
  @Input() friend!: Friend | null;
  @Input() user!: User | null;
  @ViewChild('scrollContainer') private scrollContainer!: ElementRef; // Référence à l'élément scrollable
  private messageSubscription: Subscription | null = null;
  private currentConversationId: number | null = null;
  private isInitialized = false;
  
  token$!: Observable<string | null>;
  messageList: Message[] = [];

  constructor(
    private authServices: AuthService,
    private messageService: messagesService,
    private webSocketService: WebSocketService,
     private cdr: ChangeDetectorRef
  ) {
    this.token$ = this.authServices.accessToken$;
  }

  ngOnInit(): void {
    this.isInitialized = true;
    if (this.user && this.conversation) {
      this.messageList = [];
      this.getMessages();
      this.subscribeToMessages();
      this.scrollToBottom();
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (this.isInitialized && changes['conversation'] && this.conversation) {
      if (this.conversation.conversationId !== this.currentConversationId) {
        // Réinitialiser les messages pour la nouvelle conversation
        this.messageList = [];
        this.getMessages();
        this.subscribeToMessages();
      }
    }
  }
  ngAfterViewInit(): void {
    this.scrollToBottom();
  }

  ngAfterViewChecked(): void {
    this.scrollToBottom();
  }

  ngOnDestroy(): void {
    this.unsubscribeFromMessages();
    this.webSocketService.disconnect();
    this.messageList = [];
  }

  private subscribeToMessages(): void {
  this.unsubscribeFromMessages().then(() => {
    if (this.conversation) {
      this.currentConversationId = this.conversation.conversationId;
      this.webSocketService.subscribeToConversation(this.conversation.conversationId);
      this.messageSubscription = this.webSocketService.getMessages().subscribe(message => {
        if (message) {
          this.messageList.push(message); // Ajouter le message reçu à la liste des messages
          this.cdr.detectChanges(); // Déclenche un cycle de détection des changements
          this.scrollToBottom()
        }
      });
    }
  });
}

private unsubscribeFromMessages(): Promise<void> {
    return new Promise((resolve) => {
      if (this.messageSubscription) {
        this.messageSubscription.unsubscribe();
        this.messageSubscription = null;
      }
      if (this.currentConversationId !== null) {
        this.webSocketService.unsubscribeFromConversation(this.currentConversationId);
      }
      resolve();
    });
  }

  getMessages(): void {
    if (this.conversation && this.token$) {
      this.token$.subscribe(token => {
        if (token && this.conversation) {
          this.messageService.getMessages(this.conversation.conversationId, token).subscribe({
            next: (messages) => {
              this.messageList = messages;
              this.scrollToBottom();
            },
            error: (err) => {
              console.error('Erreur lors de la récupération des messages:', err);
            }
          });
        }
      });
    }
  }
  private scrollToBottom(): void {
    try {
      if (this.scrollContainer) {
        this.scrollContainer.nativeElement.scrollTop = this.scrollContainer.nativeElement.scrollHeight;
      }
    } catch (err) {
      console.error('Erreur de scroll:', err);
    }
  }
}
