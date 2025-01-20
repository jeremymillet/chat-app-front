import { Component, Input } from '@angular/core';
import { MessageListComponent } from '../message-list/message-list.component';
import { Conversation, Friend } from '../../types/types';
import { Observable } from 'rxjs';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-conversation',
  imports: [MessageListComponent,CommonModule],
  templateUrl: './conversation.component.html',
  styleUrl: './conversation.component.scss'
})
export class ConversationComponent {
  @Input() friend!: Friend | null;
  @Input() conversation!:Conversation|null
  
  constructor() {
    
  }
}
