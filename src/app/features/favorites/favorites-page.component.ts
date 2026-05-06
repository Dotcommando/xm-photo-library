import { Component, inject } from '@angular/core';

import { FavoritesStoreService } from '../../core/services/favorites-store.service';
import { PhotoCardComponent } from '../photos/components/photo-card/photo-card.component';

@Component({
  selector: 'app-favorites-page',
  imports: [PhotoCardComponent],
  templateUrl: './favorites-page.component.html',
  styleUrl: './favorites-page.component.scss',
})
export class FavoritesPageComponent {
  protected readonly favoritesStore = inject(FavoritesStoreService);
}
