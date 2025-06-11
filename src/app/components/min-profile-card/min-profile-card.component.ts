import { CommonModule } from '@angular/common';
import { Component, Input} from '@angular/core';
import { Friend, User } from '../../types/types';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { ModalEditProfilComponent } from "../modal-edit-profil/modal-edit-profil.component";

@Component({
  selector: 'app-min-profile-card',
  imports: [CommonModule, ModalEditProfilComponent],
  templateUrl: './min-profile-card.component.html',
  styleUrl: './min-profile-card.component.scss'
})
export class MinProfileCardComponent {
  @Input() mp?: Boolean
  @Input() user?: Observable<User | null>
  @Input() friend?: Friend
  isVisible = false;
  constructor(private router: Router) {
    
  }
  handleProfileClick() {
    this.router.navigateByUrl(`conversation/${this.friend?.friendshipId}`);
  }

  showModal(): void {
    this.isVisible = true; // Affiche le modal
  }

  handleModalClose(): void {
    this.isVisible = false; // Ferme le modal
  }
}