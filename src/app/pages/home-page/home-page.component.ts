import { Component, HostListener, OnInit, ViewChild } from '@angular/core';
import { FriendsListComponent } from '../../components/friends-list/friends-list.component';
import { SearchFriendInputComponent } from '../../components/search-friend-input/search-friend-input.component';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { Friend, User } from '../../types/types';
import { Observable } from 'rxjs';
import { friendService } from '../../services/friendServices';
import { AuthService } from '../../services/authServices';
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { CommonModule } from '@angular/common';
import { FriendRequestModalComponent } from '../../components/friend-request-modal/friend-request-modal.component';
import { ConversationSideBarComponent } from '../../components/conversation-side-bar/conversation-side-bar.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home-page',
  standalone: true,
  imports: [FriendsListComponent,SearchFriendInputComponent,NzIconModule,NzSpinModule,CommonModule,FriendRequestModalComponent,ConversationSideBarComponent],
  templateUrl: './home-page.component.html',
  styleUrl: './home-page.component.scss'
})
export class HomePageComponent implements OnInit {
  isVisible = false;
  isLoadingFriends$!: Observable<boolean>;
  errorFriends$!: Observable<string | null>;
  user$!: Observable<User | null>;
  token$!: Observable<string | null>
  filteredFriends$: Observable<Friend[]>;
  filterType$: Observable<string | null>

   constructor(
    private friendServices: friendService,
    private authService: AuthService,
    private router: Router
  ) {
    this.isLoadingFriends$ = this.friendServices.isLoadingFriends$;
    this.errorFriends$ = this.friendServices.errorFriends$;
    this.user$ = this.authService.user$;
    this.token$ = this.authService.accessToken$;
     this.filteredFriends$ = this.friendServices.filteredFriends$;
     this.filterType$ = this.friendServices.filterType$
  }
  ngOnInit(): void {
    // Souscription pour récupérer l'utilisateur et charger ses amis
      this.checkRefreshToken();
      this.getFriends();
  }
   showModal(): void {
    this.isVisible = true; // Affiche le modal
  }

  handleModalClose(): void {
    this.isVisible = false; // Ferme le modal
  }
  
  setFilter(filterType: 'all' | 'pending'): void {
    this.friendServices.setFilterType(filterType);
  }
  getFriends() {
     this.user$.subscribe((user) => {
       this.token$.subscribe((token) => { 
         if (user && token) {
        this.friendServices.getFriends(user.id,token).subscribe({
          next: (response) => {
            this.friendServices.setFriends(response);
          },
          error: (err) => {
            console.error('Erreur lors de la récupération des amis', err);
          },
        });
      }
       })
     });
  }
  checkRefreshToken() {
    this.authService.refreshToken().subscribe({
      next: (response) => {
        // Si le refresh token est valide, tu peux récupérer le nouvel access token
        this.authService.setAccessToken(response.accessToken);
        this.authService.setUser(response.user);
      },
      error: (err) => {
        // Si l'erreur se produit, rediriger vers la page de login
        this.authService.deleteCookie("refreshToken");
        this.router.navigate(['/login']);
      }
    });
  }
}

