import { Component, Input } from '@angular/core';
import { Friend, Message, User } from '../../types/types';

@Component({
  selector: 'app-message',
  imports: [],
  templateUrl: './message.component.html',
  styleUrl: './message.component.scss'
})
export class MessageComponent {
  @Input() message!: Message
  @Input() friend!: Friend | null;
  @Input() user!: User | null
  

  constructor() { 
    
  }
  getFormattedDate(timestamp: Date): string {
    const date = new Date(timestamp);
    return date.toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  }
  
}
