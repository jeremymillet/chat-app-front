import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzInputModule } from 'ng-zorro-antd/input';

@Component({
  selector: 'app-friend-component',
  imports: [NzIconModule,NzInputModule,CommonModule],
  templateUrl: './friend-component.component.html',
  styleUrl: './friend-component.component.scss'
})
export class FriendComponent {
  @Input() friend!: {
    friendshipId: number, friendId: number,
    friendName: string, createdAt: string
  };
}
