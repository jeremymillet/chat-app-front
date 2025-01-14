import { Component, Input } from '@angular/core';
import { FriendComponent } from '../friend/friend-component.component';
import { CommonModule } from '@angular/common';
import { Friend } from '../../types/types';
import { Observable } from 'rxjs';


@Component({
  selector: 'app-friends-list',
  imports: [FriendComponent,CommonModule],
  templateUrl: './friends-list.component.html',
  styleUrl: './friends-list.component.scss'
})
export class FriendsListComponent {
  @Input() filtredFriends$?: Observable<Friend[] | null>;
}
