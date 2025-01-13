import { Component } from '@angular/core';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzInputModule } from 'ng-zorro-antd/input';

@Component({
  selector: 'app-search-friend-input',
  imports: [NzInputModule,NzIconModule],
  templateUrl: './search-friend-input.component.html',
  styleUrl: './search-friend-input.component.scss'
})
export class SearchFriendInputComponent {

}
