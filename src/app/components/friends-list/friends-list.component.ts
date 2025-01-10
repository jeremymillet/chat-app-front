import { Component } from '@angular/core';
import { FriendComponent } from '../friend/friend-component.component';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-friends-list',
  imports: [FriendComponent,CommonModule],
  templateUrl: './friends-list.component.html',
  styleUrl: './friends-list.component.scss'
})
export class FriendsListComponent {
  friends = [
    { name: 'Alice'},
    { name: 'Bob'},
    { name: 'Charlie'}
  ];
}
