import { TestBed } from '@angular/core/testing';

import { IPhoto } from '../models/photo.model';
import { FavoritesStoreService } from './favorites-store.service';

describe('FavoritesStoreService', () => {
  let service: FavoritesStoreService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FavoritesStoreService);
  });

  it('should create', () => {
    expect(service).toBeTruthy();
  });

  it('should add favorites to the end of the list', () => {
    const firstPhoto = createPhoto('photo-1');
    const secondPhoto = createPhoto('photo-2');

    service.add(firstPhoto);
    service.add(secondPhoto);

    expect(service.favorites()).toEqual([firstPhoto, secondPhoto]);
  });

  it('should not add the same photo twice', () => {
    const photo = createPhoto('photo-1');

    service.add(photo);
    service.add(photo);

    expect(service.favorites()).toEqual([photo]);
  });

  it('should expose favorite ids', () => {
    const photo = createPhoto('photo-1');

    service.add(photo);

    expect(service.favoriteIds().has(photo.id)).toBe(true);
    expect(service.isFavorite(photo.id)).toBe(true);
    expect(service.isFavorite('missing-photo')).toBe(false);
  });

  it('should find favorite by id', () => {
    const photo = createPhoto('photo-1');

    service.add(photo);

    expect(service.findById(photo.id)).toEqual(photo);
    expect(service.findById('missing-photo')).toBeUndefined();
  });

  it('should remove favorite by id', () => {
    const firstPhoto = createPhoto('photo-1');
    const secondPhoto = createPhoto('photo-2');

    service.add(firstPhoto);
    service.add(secondPhoto);
    service.remove(firstPhoto.id);

    expect(service.favorites()).toEqual([secondPhoto]);
    expect(service.isFavorite(firstPhoto.id)).toBe(false);
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
