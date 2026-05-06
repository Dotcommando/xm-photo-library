import { signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import { IPhoto } from '../../core/models/photo.model';
import { PhotosStoreService } from '../../core/services/photos-store.service';
import { PhotosPageComponent } from './photos-page.component';

type ObserverCallback = IntersectionObserverCallback;

describe('PhotosPageComponent', () => {
  const originalIntersectionObserver = window.IntersectionObserver;
  const photos: IPhoto[] = [createPhoto('photo-1'), createPhoto('photo-2'), createPhoto('photo-3')];

  let photosStore: {
    photos: ReturnType<typeof signal<IPhoto[]>>;
    loading: ReturnType<typeof signal<boolean>>;
    loadNextPage: ReturnType<typeof vi.fn>;
  };
  let observerInstances: IntersectionObserverMock[];

  beforeEach(async () => {
    observerInstances = [];
    window.IntersectionObserver = class extends IntersectionObserverMock {
      constructor(callback: ObserverCallback, options?: IntersectionObserverInit) {
        super(callback, options);
        observerInstances.push(this);
      }
    } as unknown as typeof IntersectionObserver;

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

  afterEach(() => {
    window.IntersectionObserver = originalIntersectionObserver;
    vi.restoreAllMocks();
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

  it('should render the infinite scroll anchor', () => {
    const fixture = TestBed.createComponent(PhotosPageComponent);
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('.scroll-anchor')).toBeTruthy();
    expect(observerInstances.at(-1)?.options.rootMargin).toBe('320px');
  });

  it('should load the next page when the scroll anchor intersects', () => {
    const fixture = TestBed.createComponent(PhotosPageComponent);
    fixture.detectChanges();
    photosStore.loadNextPage.mockClear();

    observerInstances.at(-1)?.emit(true);

    expect(photosStore.loadNextPage).toHaveBeenCalledOnce();
  });

  it('should not load the next page from the scroll anchor while loading', () => {
    photosStore.loading.set(true);
    const fixture = TestBed.createComponent(PhotosPageComponent);
    fixture.detectChanges();
    photosStore.loadNextPage.mockClear();

    observerInstances.at(-1)?.emit(true);

    expect(photosStore.loadNextPage).not.toHaveBeenCalled();
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

class IntersectionObserverMock {
  constructor(
    private readonly callback: ObserverCallback,
    readonly options: IntersectionObserverInit = {},
  ) {}

  observe(): void {}

  disconnect(): void {}

  emit(isIntersecting: boolean): void {
    this.callback(
      [
        {
          isIntersecting,
        } as IntersectionObserverEntry,
      ],
      this as unknown as IntersectionObserver,
    );
  }
}
