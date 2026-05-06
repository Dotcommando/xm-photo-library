import { Injectable, computed, inject, signal } from '@angular/core';

import { IPhoto } from '../models/photo.model';
import { LocalStorageService } from './local-storage.service';

@Injectable({
  providedIn: 'root',
})
export class FavoritesStoreService {
  private readonly storageKey = 'xm-photo-library-favorites';
  private readonly localStorageService = inject(LocalStorageService);
  private readonly favoritesState = signal<IPhoto[]>(
    this.localStorageService.get<IPhoto[]>(this.storageKey) ?? [],
  );

  readonly favorites = this.favoritesState.asReadonly();

  readonly favoriteIds = computed(() => {
    return new Set(this.favoritesState().map((photo) => photo.id));
  });

  add(photo: IPhoto): void {
    if (this.isFavorite(photo.id)) {
      return;
    }

    this.updateFavorites([...this.favoritesState(), photo]);
  }

  remove(photoId: string): void {
    this.updateFavorites(this.favoritesState().filter((photo) => photo.id !== photoId));
  }

  isFavorite(photoId: string): boolean {
    return this.favoriteIds().has(photoId);
  }

  findById(photoId: string): IPhoto | undefined {
    return this.favoritesState().find((photo) => photo.id === photoId);
  }

  private updateFavorites(favorites: IPhoto[]): void {
    this.favoritesState.set(favorites);
    this.localStorageService.set(this.storageKey, favorites);
  }
}
