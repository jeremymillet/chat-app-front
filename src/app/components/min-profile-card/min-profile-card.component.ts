import { CommonModule } from '@angular/common';
import { Component, Input} from '@angular/core';
import { User } from '../../types/types';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-min-profile-card',
  imports: [CommonModule],
  templateUrl: './min-profile-card.component.html',
  styleUrl: './min-profile-card.component.scss'
})
export class MinProfileCardComponent {
  @Input() mp?: Boolean
  @Input() user?: Observable<User| null>
}
