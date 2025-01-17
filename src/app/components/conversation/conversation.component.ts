import { Component, Input } from '@angular/core';
import { MessageListComponent } from '../message-list/message-list.component';
import { Conversation, Friend } from '../../types/types';

@Component({
  selector: 'app-conversation',
  imports: [MessageListComponent],
  templateUrl: './conversation.component.html',
  styleUrl: './conversation.component.scss'
})
export class ConversationComponent {
  @Input() friend!: Friend
  @Input() conversation!: Conversation
  
  constructor() {
    
  }
}
