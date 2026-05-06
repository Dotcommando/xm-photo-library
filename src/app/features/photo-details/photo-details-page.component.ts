import { Component, computed, inject, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ActivatedRoute, Router } from '@angular/router';

import { FavoritesStoreService } from '../../core/services/favorites-store.service';

@Component({
  selector: 'app-photo-details-page',
  imports: [MatButtonModule, MatProgressSpinnerModule],
  templateUrl: './photo-details-page.component.html',
  styleUrl: './photo-details-page.component.scss',
})
export class PhotoDetailsPageComponent {
  private readonly favoritesStore = inject(FavoritesStoreService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly photoId = this.route.snapshot.paramMap.get('id') ?? '';

  protected readonly photo = computed(() => {
    return this.favoritesStore.findById(this.photoId);
  });
  protected readonly imageLoaded = signal(false);

  protected markImageLoaded(): void {
    this.imageLoaded.set(true);
  }

  protected removeFromFavorites(): void {
    const photo = this.photo();

    if (!photo) {
      return;
    }

    this.favoritesStore.remove(photo.id);
    void this.router.navigateByUrl('/favorites');
  }
}
