import { TestBed } from '@angular/core/testing';

import { IPhoto } from '../models/photo.model';
import { FavoritesStoreService } from './favorites-store.service';
import { LocalStorageService } from './local-storage.service';

describe('FavoritesStoreService', () => {
  const storageKey = 'xm-photo-library-favorites';
  let service: FavoritesStoreService;
  let localStorageService: {
    get: ReturnType<typeof vi.fn>;
    set: ReturnType<typeof vi.fn>;
  };

  beforeEach(() => {
    localStorageService = {
      get: vi.fn().mockReturnValue(null),
      set: vi.fn(),
    };

    TestBed.configureTestingModule({
      providers: [{ provide: LocalStorageService, useValue: localStorageService }],
    });
    service = TestBed.inject(FavoritesStoreService);
  });

  it('should create', () => {
    expect(service).toBeTruthy();
  });

  it('should restore favorites from local storage', () => {
    const photo = createPhoto('photo-1');
    TestBed.resetTestingModule();
    localStorageService = {
      get: vi.fn().mockReturnValue([photo]),
      set: vi.fn(),
    };
    TestBed.configureTestingModule({
      providers: [{ provide: LocalStorageService, useValue: localStorageService }],
    });

    service = TestBed.inject(FavoritesStoreService);

    expect(localStorageService.get).toHaveBeenCalledWith(storageKey);
    expect(service.favorites()).toEqual([photo]);
  });

  it('should add favorites to the end of the list', () => {
    const firstPhoto = createPhoto('photo-1');
    const secondPhoto = createPhoto('photo-2');

    service.add(firstPhoto);
    service.add(secondPhoto);

    expect(service.favorites()).toEqual([firstPhoto, secondPhoto]);
    expect(localStorageService.set).toHaveBeenLastCalledWith(storageKey, [firstPhoto, secondPhoto]);
  });

  it('should not add the same photo twice', () => {
    const photo = createPhoto('photo-1');

    service.add(photo);
    service.add(photo);

    expect(service.favorites()).toEqual([photo]);
    expect(localStorageService.set).toHaveBeenCalledTimes(1);
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
    expect(localStorageService.set).toHaveBeenLastCalledWith(storageKey, [secondPhoto]);
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
