import { Component, Input } from '@angular/core';
import { NzIconModule } from 'ng-zorro-antd/icon';

@Component({
  selector: 'app-friend-component',
  imports: [NzIconModule],
  templateUrl: './friend-component.component.html',
  styleUrl: './friend-component.component.scss'
})
export class FriendComponent {
  @Input() friend!: { name: string};
}
