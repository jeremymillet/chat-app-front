import { Component } from '@angular/core';
import { ConversationSideBarComponent } from '../../components/conversation-side-bar/conversation-side-bar.component';
import { Observable } from 'rxjs';
import { friendService } from '../../services/friendServices';
import { AuthService } from '../../services/authServices';
import { Friend, User } from '../../types/types';
import { ConversationComponent } from '../../components/conversation/conversation.component';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-conversation-page',
  imports: [ConversationSideBarComponent,ConversationComponent],
  templateUrl: './conversation-page.component.html',
  styleUrl: './conversation-page.component.scss'
})
export class ConversationPageComponent {
  user$!: Observable<User | null>;
  token$!: Observable<string | null>
  friendshipId!: number; 
  friend!: Friend;

  constructor(private authService: AuthService,private friendServices: friendService,private route: ActivatedRoute) {
    this.user$ = this.authService.user$;
    this.token$ = this.authService.token$;

    this.route.paramMap.subscribe((params) => {
      const id = params.get('id'); // Récupère 'id' défini dans la route
      if (id) {
        this.friendshipId = Number(id); // Convertir en nombre
        console.log('Friendship ID:', this.friendshipId);
      }
    });

    this.user$.subscribe((user) => {
       this.token$.subscribe((token) => { 
        if (user && token) {
        
        this.friendServices.getFriend(user.id,this.friendshipId,token).subscribe({
          next: (response) => {
            console.log('recuperation des friends : ', response);
            this.friend = response;
          },
          error: (err) => {
            console.error('Erreur lors de la récupération des amis', err);
          },
        });
      }
       })
     });
  }
}
