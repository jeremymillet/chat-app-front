import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { MinProfileCardComponent } from '../min-profile-card/min-profile-card.component';
import { Friend, User } from '../../types/types';
import { Observable } from 'rxjs';
import { AuthService } from '../../services/authServices';
import { friendService } from '../../services/friendServices';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-conversation-side-bar',
  imports: [MinProfileCardComponent,CommonModule],
  templateUrl: './conversation-side-bar.component.html',
  styleUrl: './conversation-side-bar.component.scss'
})
export class ConversationSideBarComponent implements OnInit{
  @Input() user$!: Observable<User | null>
  @ViewChild('minProfileCard') minProfileCard!: ElementRef;
  @Output() toggleSidebar = new EventEmitter<void>();
  token$!: Observable<string | null>

  friendsWithConversation : Friend[] = [];
  
  constructor(private authService: AuthService, private friendServices: friendService) {
    this.token$ = this.authService.accessToken$;
  }
  
  ngOnInit(): void { 
    if (this.user$) {
      this.user$.subscribe((user) => {
       this.token$.subscribe((token) => { 
         if (user && token) {
        this.friendServices.getFriendsWithConversations(user.id,token).subscribe({
          next: (response) => {
            this.setFriendsWithConversation(response);
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
  setFriendsWithConversation(friends: Friend[]) {
    this.friendsWithConversation = friends;
  }

  closeSidebar() {
    document.getElementById('conversations')?.classList.toggle('hide-on-mobil');
    document.getElementById('min-profil-card')?.classList.toggle('hide-on-mobil');
    this.toggleSidebar.emit();
  }

  
  

}
