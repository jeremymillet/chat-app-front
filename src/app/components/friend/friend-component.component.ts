import { CommonModule } from '@angular/common';
import { Component,ElementRef,HostListener, Input} from '@angular/core';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzInputModule } from 'ng-zorro-antd/input';
import { friendService } from '../../services/friendServices';
import { AuthService } from '../../services/authServices';
import { Observable } from 'rxjs';
import { NzPopconfirmModule } from 'ng-zorro-antd/popconfirm';
import { Router } from '@angular/router';



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

  constructor(private friendServices: friendService, private authService: AuthService
    ,private elementRef: ElementRef,private router: Router
  ) { this.token$ = this.authService.accessToken$};
  accepteFriendrequest(): void {
    this.token$.subscribe((token) => {
      if (token) {
        this.friendServices.acceptFriendRequest(this.userId, this.friend.friendId,token).subscribe({
        next: (response) => {
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
  deleteFriend(): void {
    this.token$.subscribe((token) => {
      if (token) {
        this.friendServices.deleteFriend(this.friend.friendshipId,token).subscribe({
        next: (response) => {
  
          alert('friend deleted');
        },
        error: (err) => {
          console.error('Error sent request', err);
        },
      });
      }
    }
    )
  }
  
  handleMessageBtn() {
    this.router.navigateByUrl(`/conversation/${this.friend.friendshipId}`);
  }
  cancel(): void {
    this.closeModal()
  }

  confirm(): void {
    this.deleteFriend()
  }
    
  onModalClick(event: Event) {
    event.stopPropagation();
  }
  closeModal(): void { 
    this.isVisible = false;
  }
   @HostListener('document:click', ['$event'])
  onDocumentClick(event: Event) {
    const clickedInside = this.elementRef.nativeElement.contains(event.target);
    if (!clickedInside) {
      this.isVisible = false; // Ferme la modale si le clic est à l'extérieur
    }
  }

}




  

