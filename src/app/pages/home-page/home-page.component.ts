import { Component } from '@angular/core';
import { FriendsListComponent } from '../../components/friends-list/friends-list.component';
import { SearchFriendInputComponent } from '../../components/search-friend-input/search-friend-input.component';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { MinProfileCardComponent } from '../../components/min-profile-card/min-profile-card.component';

@Component({
  selector: 'app-home-page',
  imports: [FriendsListComponent,SearchFriendInputComponent,NzIconModule,MinProfileCardComponent],
  templateUrl: './home-page.component.html',
  styleUrl: './home-page.component.scss'
})
export class HomePageComponent {

}
