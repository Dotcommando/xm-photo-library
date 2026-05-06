import { Injectable, computed, signal } from '@angular/core';

import { IPhoto } from '../models/photo.model';

@Injectable({
  providedIn: 'root',
})
export class FavoritesStoreService {
  private readonly favoritesState = signal<IPhoto[]>([]);

  readonly favorites = this.favoritesState.asReadonly();

  readonly favoriteIds = computed(() => {
    return new Set(this.favoritesState().map((photo) => photo.id));
  });

  add(photo: IPhoto): void {
    if (this.isFavorite(photo.id)) {
      return;
    }

    this.favoritesState.update((favorites) => [...favorites, photo]);
  }

  remove(photoId: string): void {
    this.favoritesState.update((favorites) => {
      return favorites.filter((photo) => photo.id !== photoId);
    });
  }

  isFavorite(photoId: string): boolean {
    return this.favoriteIds().has(photoId);
  }

  findById(photoId: string): IPhoto | undefined {
    return this.favoritesState().find((photo) => photo.id === photoId);
  }
}
