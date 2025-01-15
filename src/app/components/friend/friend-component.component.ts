import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzInputModule } from 'ng-zorro-antd/input';
import { friendService } from '../../services/friendServices';
import { AuthService } from '../../services/authServices';
import { Observable } from 'rxjs';
import { NzPopconfirmModule } from 'ng-zorro-antd/popconfirm';


@Component({
  selector: 'app-friend-component',
  imports: [NzIconModule, NzInputModule, CommonModule,NzPopconfirmModule],
  templateUrl: './friend-component.component.html',
  styleUrl: './friend-component.component.scss'
})
export class FriendComponent {
  @Input() friend!: {
    friendshipId: number, friendId: number,
    friendName: string, createdAt: string,
    isAccepted: boolean, requestSenderId: number,
  };
  @Input() userId!: number
  token$!: Observable<string | null>

  isVisible: boolean = false;

  constructor(private friendServices: friendService, private authService: AuthService) { this.token$ = this.authService.token$ };
  accepteFriendrequest(): void {
    this.token$.subscribe((token) => {
      if (token) {
        this.friendServices.acceptFriendRequest(this.userId, this.friend.friendId,token).subscribe({
        next: (response) => {
          console.log('accepte : ', response);
          alert('friend accepte');
        },
        error: (err) => {
          console.error('Error sent request', err);
        },
      });
      }
    }
    )
  }
  

cancel(): void {

}

confirm(): void {
 
}
}



  

