import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';

import { IPhoto } from '../../core/models/photo.model';
import { FavoritesStoreService } from '../../core/services/favorites-store.service';
import { PhotoCardComponent } from '../photos/components/photo-card/photo-card.component';

@Component({
  selector: 'app-favorites-page',
  imports: [PhotoCardComponent],
  templateUrl: './favorites-page.component.html',
  styleUrl: './favorites-page.component.scss',
})
export class FavoritesPageComponent {
  private readonly router = inject(Router);

  protected readonly favoritesStore = inject(FavoritesStoreService);

  protected openPhoto(photo: IPhoto): void {
    void this.router.navigate(['/photos', photo.id]);
  }
}
