import { signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import { IPhoto } from '../../core/models/photo.model';
import { FavoritesStoreService } from '../../core/services/favorites-store.service';
import { FavoritesPageComponent } from './favorites-page.component';

describe('FavoritesPageComponent', () => {
  const photos: IPhoto[] = [createPhoto('photo-1'), createPhoto('photo-2')];

  let favoritesStore: {
    favorites: ReturnType<typeof signal<IPhoto[]>>;
  };

  beforeEach(async () => {
    favoritesStore = {
      favorites: signal(photos),
    };

    await TestBed.configureTestingModule({
      imports: [FavoritesPageComponent],
      providers: [{ provide: FavoritesStoreService, useValue: favoritesStore }],
    }).compileComponents();
  });

  it('should render favorite photos', () => {
    const fixture = TestBed.createComponent(FavoritesPageComponent);

    fixture.detectChanges();

    expect(fixture.nativeElement.querySelectorAll('app-photo-card').length).toBe(2);
    expect(fixture.nativeElement.querySelector('.empty-state')).toBeFalsy();
  });

  it('should render favorite indicators as active', () => {
    const fixture = TestBed.createComponent(FavoritesPageComponent);

    fixture.detectChanges();

    const favoriteIndicators = fixture.nativeElement.querySelectorAll(
      '.photo-card__favorite--active',
    );

    expect(favoriteIndicators.length).toBe(2);
  });

  it('should show an empty state when there are no favorites', () => {
    favoritesStore.favorites.set([]);
    const fixture = TestBed.createComponent(FavoritesPageComponent);

    fixture.detectChanges();

    expect(fixture.nativeElement.querySelectorAll('app-photo-card').length).toBe(0);
    expect(fixture.nativeElement.querySelector('.empty-state')?.textContent?.trim()).toBe(
      'No favorite photos yet.',
    );
  });
});

function createPhoto(id: string): IPhoto {
  return {
    id,
    seed: id,
    thumbnailUrl: `https://picsum.photos/seed/${id}/200/300`,
    fullUrl: `https://picsum.photos/seed/${id}/1200/1800`,
  };
}
