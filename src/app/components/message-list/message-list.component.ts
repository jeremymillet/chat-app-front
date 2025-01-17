import { Component, Input } from '@angular/core';
import { MessageComponent } from '../message/message.component';
import { Conversation } from '../../types/types';

@Component({
  selector: 'app-message-list',
  imports: [MessageComponent],
  templateUrl: './message-list.component.html',
  styleUrl: './message-list.component.scss'
})
export class MessageListComponent {
  @Input() conversation!: Conversation;
  
  constructor() {
    
  }
}
