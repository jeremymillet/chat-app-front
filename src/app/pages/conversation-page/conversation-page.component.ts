import { Component } from '@angular/core';
import { ConversationSideBarComponent } from '../../components/conversation-side-bar/conversation-side-bar.component';
import { BehaviorSubject, Observable, Subscription } from 'rxjs';
import { friendService } from '../../services/friendServices';
import { AuthService } from '../../services/authServices';
import { Conversation, Friend, User } from '../../types/types';
import { ConversationComponent } from '../../components/conversation/conversation.component';
import { ActivatedRoute } from '@angular/router';
import { conversationsService } from '../../services/conversationServices';
import { CommonModule } from '@angular/common';
import { WebSocketService } from '../../services/webSocketServices';

@Component({
  selector: 'app-conversation-page',
  imports: [ConversationSideBarComponent,ConversationComponent,CommonModule],
  templateUrl: './conversation-page.component.html',
  styleUrl: './conversation-page.component.scss'
})
export class ConversationPageComponent { 
  user$!: Observable<User | null>;
  token$!: Observable<string | null>
  friendshipId!: number; 
  private friendSubject = new BehaviorSubject<Friend | null>(null);
  public friend$ = this.friendSubject.asObservable();

  private conversationSubject = new BehaviorSubject<Conversation | null>(null);
  public conversation$ = this.conversationSubject.asObservable();

  constructor(private conversationServices: conversationsService, private authService: AuthService,
    private friendServices: friendService, private route: ActivatedRoute) {
    this.user$ = this.authService.user$;
    this.token$ = this.authService.token$;
  }

  ngOnInit(): void {
    // Récupérer l'ID de l'ami à partir des paramètres de la route
    this.route.paramMap.subscribe((params) => {
      const id = params.get('id');
      if (id) {
        this.friendshipId = Number(id);
        console.log('Friendship ID:', this.friendshipId);

        // Lancer les appels API dans ngOnInit
        this.loadData();
      }
    });
  }

  loadData(): void {
    // Souscrire à l'utilisateur et au token
    this.user$.subscribe((user) => {
      this.token$.subscribe((token) => {
        if (user && token) {
          // Récupérer les informations de l'ami
          this.friendServices.getFriend(user.id, this.friendshipId, token).subscribe({
            next: (response) => {
              console.log('Récupération des amis : ', response);
              this.friendSubject.next(response);

              // Récupérer la conversation de l'ami
              this.conversationServices.getConversation(this.friendshipId, token).subscribe({
                next: (response) => {
                  this.conversationSubject.next(response);
                  console.log('Récupération des conversations : ', response);
                },
                error: (err) => {
                  console.error('Erreur lors de la récupération des conversations', err);
                }
              });
            },
            error: (err) => {
              console.error('Erreur lors de la récupération des amis', err);
            }
          });
        }
      });
    });
  }
}
