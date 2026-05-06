import { signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import { IPhoto } from '../../core/models/photo.model';
import { PhotosStoreService } from '../../core/services/photos-store.service';
import { PhotosPageComponent } from './photos-page.component';

describe('PhotosPageComponent', () => {
  const photos: IPhoto[] = [createPhoto('photo-1'), createPhoto('photo-2'), createPhoto('photo-3')];

  let photosStore: {
    photos: ReturnType<typeof signal<IPhoto[]>>;
    loading: ReturnType<typeof signal<boolean>>;
    loadNextPage: ReturnType<typeof vi.fn>;
  };

  beforeEach(async () => {
    photosStore = {
      photos: signal(photos),
      loading: signal(false),
      loadNextPage: vi.fn(),
    };

    await TestBed.configureTestingModule({
      imports: [PhotosPageComponent],
      providers: [{ provide: PhotosStoreService, useValue: photosStore }],
    }).compileComponents();
  });

  it('should render photos from the store', () => {
    const fixture = TestBed.createComponent(PhotosPageComponent);

    fixture.detectChanges();

    expect(photosStore.loadNextPage).not.toHaveBeenCalled();
    expect(fixture.nativeElement.querySelectorAll('app-photo-card').length).toBe(3);
  });

  it('should load photos when the store is empty', () => {
    photosStore.photos.set([]);
    const fixture = TestBed.createComponent(PhotosPageComponent);

    fixture.detectChanges();

    expect(photosStore.loadNextPage).toHaveBeenCalledOnce();
  });

  it('should show the loader while photos are loading', () => {
    photosStore.loading.set(true);
    const fixture = TestBed.createComponent(PhotosPageComponent);

    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('mat-progress-spinner')).toBeTruthy();
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
