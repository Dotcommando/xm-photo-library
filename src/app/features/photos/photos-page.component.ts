import { DOCUMENT } from '@angular/common';
import { AfterViewInit, Component, OnDestroy, OnInit, inject } from '@angular/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { IPhoto } from '../../core/models/photo.model';
import { FavoritesStoreService } from '../../core/services/favorites-store.service';
import { PhotosStoreService } from '../../core/services/photos-store.service';
import { ScrollPositionService } from '../../core/services/scroll-position.service';
import { InfiniteScrollDirective } from '../../shared/directives/infinite-scroll.directive';
import { PhotoCardComponent } from './components/photo-card/photo-card.component';

const PHOTOS_SCROLL_POSITION_KEY = 'photos';

@Component({
  selector: 'app-photos-page',
  imports: [InfiniteScrollDirective, MatProgressSpinnerModule, PhotoCardComponent],
  templateUrl: './photos-page.component.html',
  styleUrl: './photos-page.component.scss',
})
export class PhotosPageComponent implements AfterViewInit, OnDestroy, OnInit {
  private readonly document = inject(DOCUMENT);
  private readonly scrollPositionService = inject(ScrollPositionService);

  protected readonly favoritesStore = inject(FavoritesStoreService);
  protected readonly photosStore = inject(PhotosStoreService);
  protected readonly favoriteIds = this.favoritesStore.favoriteIds;

  ngOnInit(): void {
    if (this.photosStore.photos().length === 0) {
      this.photosStore.loadNextPage();
    }
  }

  ngAfterViewInit(): void {
    this.restoreScrollPosition();
  }

  ngOnDestroy(): void {
    const windowRef = this.document.defaultView;

    if (!windowRef) {
      return;
    }

    this.scrollPositionService.save(PHOTOS_SCROLL_POSITION_KEY, windowRef.scrollY);
  }

  protected loadMorePhotos(): void {
    this.photosStore.loadNextPage();
  }

  protected addPhotoToFavorites(photo: IPhoto): void {
    this.favoritesStore.add(photo);
  }

  private restoreScrollPosition(): void {
    const windowRef = this.document.defaultView;
    const position = this.scrollPositionService.get(PHOTOS_SCROLL_POSITION_KEY);

    if (!windowRef || position === 0) {
      return;
    }

    queueMicrotask(() => {
      windowRef.requestAnimationFrame(() => {
        windowRef.scrollTo({
          top: position,
          left: 0,
          behavior: 'instant',
        });
      });
    });
  }
}
