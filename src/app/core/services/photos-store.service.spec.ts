import { TestBed } from '@angular/core/testing';
import { Subject } from 'rxjs';

import { IPhoto, IPhotosPage } from '../models/photo.model';
import { PhotosApiService } from './photos-api.service';
import { PhotosStoreService } from './photos-store.service';

describe('PhotosStoreService', () => {
  let service: PhotosStoreService;
  let photosApiService: {
    getPhotos: ReturnType<typeof vi.fn>;
  };

  beforeEach(() => {
    photosApiService = {
      getPhotos: vi.fn(),
    };

    TestBed.configureTestingModule({
      providers: [{ provide: PhotosApiService, useValue: photosApiService }],
    });

    service = TestBed.inject(PhotosStoreService);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should create', () => {
    expect(service).toBeTruthy();
  });

  it('should load the first photos page and update state', () => {
    const page$ = new Subject<IPhotosPage>();
    const items = [createPhoto('photo-1'), createPhoto('photo-2')];
    photosApiService.getPhotos.mockReturnValue(page$);

    service.loadNextPage();

    expect(service.loading()).toBe(true);
    expect(photosApiService.getPhotos).toHaveBeenCalledWith({ offset: 0, limit: 6 });
    expect(service.photos()).toEqual([]);

    page$.next({ items, nextOffset: 6 });
    page$.complete();

    expect(service.loading()).toBe(false);
    expect(service.photos()).toEqual(items);
  });

  it('should append loaded pages and request the next offset', () => {
    const firstPage$ = new Subject<IPhotosPage>();
    const secondPage$ = new Subject<IPhotosPage>();
    const firstItems = [createPhoto('photo-1')];
    const secondItems = [createPhoto('photo-2')];
    photosApiService.getPhotos.mockReturnValueOnce(firstPage$).mockReturnValueOnce(secondPage$);

    service.loadNextPage();
    firstPage$.next({ items: firstItems, nextOffset: 6 });
    firstPage$.complete();

    service.loadNextPage();

    expect(photosApiService.getPhotos).toHaveBeenLastCalledWith({ offset: 6, limit: 6 });

    secondPage$.next({ items: secondItems, nextOffset: 12 });
    secondPage$.complete();

    expect(service.photos()).toEqual([...firstItems, ...secondItems]);
    expect(service.loading()).toBe(false);
  });

  it('should not start a second request while photos are loading', () => {
    const page$ = new Subject<IPhotosPage>();
    photosApiService.getPhotos.mockReturnValue(page$);

    service.loadNextPage();
    service.loadNextPage();

    expect(photosApiService.getPhotos).toHaveBeenCalledTimes(1);

    page$.next({ items: [createPhoto('photo-1')], nextOffset: 6 });
    page$.complete();

    service.loadNextPage();

    expect(photosApiService.getPhotos).toHaveBeenCalledTimes(2);
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
