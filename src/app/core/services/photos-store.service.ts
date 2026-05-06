import { Injectable, inject, signal } from '@angular/core';
import { finalize } from 'rxjs';

import { IPhoto } from '../models/photo.model';
import { PhotosApiService } from './photos-api.service';

const PHOTOS_PAGE_SIZE = 6;

@Injectable({
  providedIn: 'root',
})
export class PhotosStoreService {
  private readonly photosApiService = inject(PhotosApiService);

  private readonly photosState = signal<IPhoto[]>([]);
  private readonly loadingState = signal(false);
  private readonly offsetState = signal(0);

  readonly photos = this.photosState.asReadonly();
  readonly loading = this.loadingState.asReadonly();

  loadNextPage(): void {
    if (this.loadingState()) {
      return;
    }

    this.loadingState.set(true);

    this.photosApiService
      .getPhotos({
        offset: this.offsetState(),
        limit: PHOTOS_PAGE_SIZE,
      })
      .pipe(finalize(() => this.loadingState.set(false)))
      .subscribe((page) => {
        this.photosState.update((photos) => [...photos, ...page.items]);
        this.offsetState.set(page.nextOffset);
      });
  }
}
