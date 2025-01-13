import { Component, Input } from '@angular/core';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzInputModule } from 'ng-zorro-antd/input';

@Component({
  selector: 'app-friend-component',
  imports: [NzIconModule,NzInputModule],
  templateUrl: './friend-component.component.html',
  styleUrl: './friend-component.component.scss'
})
export class FriendComponent {
  @Input() friend!: { name: string};
}
