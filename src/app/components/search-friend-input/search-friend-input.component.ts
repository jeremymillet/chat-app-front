import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzInputModule } from 'ng-zorro-antd/input';
import { Friend } from '../../types/types';
import { friendService } from '../../services/friendServices';
import { Observable } from 'rxjs';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-search-friend-input',
  imports: [NzInputModule,NzIconModule,CommonModule,FormsModule],
  templateUrl: './search-friend-input.component.html',
  styleUrl: './search-friend-input.component.scss'
})
export class SearchFriendInputComponent {
  friends$!: Observable<Friend[] | null>;
  searchTerm: string = '';
  
  constructor(private friendServices: friendService) { }
  
  onSearch(): void {
    this.friendServices.filterFriends(this.searchTerm);
  }
}

