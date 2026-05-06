import { Component, OnInit, inject } from '@angular/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { IPhoto } from '../../core/models/photo.model';
import { FavoritesStoreService } from '../../core/services/favorites-store.service';
import { PhotosStoreService } from '../../core/services/photos-store.service';
import { InfiniteScrollDirective } from '../../shared/directives/infinite-scroll.directive';
import { PhotoCardComponent } from './components/photo-card/photo-card.component';

@Component({
  selector: 'app-photos-page',
  imports: [InfiniteScrollDirective, MatProgressSpinnerModule, PhotoCardComponent],
  templateUrl: './photos-page.component.html',
  styleUrl: './photos-page.component.scss',
})
export class PhotosPageComponent implements OnInit {
  protected readonly favoritesStore = inject(FavoritesStoreService);
  protected readonly photosStore = inject(PhotosStoreService);
  protected readonly favoriteIds = this.favoritesStore.favoriteIds;

  ngOnInit(): void {
    if (this.photosStore.photos().length === 0) {
      this.photosStore.loadNextPage();
    }
  }

  protected loadMorePhotos(): void {
    this.photosStore.loadNextPage();
  }

  protected addPhotoToFavorites(photo: IPhoto): void {
    this.favoritesStore.add(photo);
  }
}
