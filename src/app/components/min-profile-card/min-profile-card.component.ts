import { CommonModule } from '@angular/common';
import { Component, Input} from '@angular/core';
import { Friend, User } from '../../types/types';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'app-min-profile-card',
  imports: [CommonModule],
  templateUrl: './min-profile-card.component.html',
  styleUrl: './min-profile-card.component.scss'
})
export class MinProfileCardComponent {
  @Input() mp?: Boolean
  @Input() user?: Observable<User | null>
  @Input() friend?: Friend
  constructor(private router: Router) {
    
  }
  handleProfileClick() {
    this.router.navigateByUrl(`conversation/${this.friend?.friendshipId}`);
  }
}
