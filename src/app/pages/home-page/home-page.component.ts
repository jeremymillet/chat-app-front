import { Component } from '@angular/core';
import { FriendsListComponent } from '../../components/friends-list/friends-list.component';

@Component({
  selector: 'app-home-page',
  imports: [FriendsListComponent],
  templateUrl: './home-page.component.html',
  styleUrl: './home-page.component.scss'
})
export class HomePageComponent {

}
