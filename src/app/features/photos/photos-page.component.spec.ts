import { signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import { IPhoto } from '../../core/models/photo.model';
import { FavoritesStoreService } from '../../core/services/favorites-store.service';
import { PhotosStoreService } from '../../core/services/photos-store.service';
import { ScrollPositionService } from '../../core/services/scroll-position.service';
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
  let favoritesStore: {
    favoriteIds: ReturnType<typeof signal<Set<string>>>;
    add: ReturnType<typeof vi.fn>;
  };
  let scrollPositionService: {
    get: ReturnType<typeof vi.fn>;
    save: ReturnType<typeof vi.fn>;
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
    favoritesStore = {
      favoriteIds: signal(new Set<string>()),
      add: vi.fn(),
    };
    scrollPositionService = {
      get: vi.fn().mockReturnValue(0),
      save: vi.fn(),
    };

    await TestBed.configureTestingModule({
      imports: [PhotosPageComponent],
      providers: [
        { provide: FavoritesStoreService, useValue: favoritesStore },
        { provide: PhotosStoreService, useValue: photosStore },
        { provide: ScrollPositionService, useValue: scrollPositionService },
      ],
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

  it('should add a photo to favorites when the photo card is clicked', () => {
    const fixture = TestBed.createComponent(PhotosPageComponent);
    fixture.detectChanges();

    const firstCard = fixture.nativeElement.querySelector('.photo-card') as HTMLButtonElement;
    firstCard.click();

    expect(favoritesStore.add).toHaveBeenCalledWith(photos[0]);
  });

  it('should pass favorite state to photo cards', () => {
    favoritesStore.favoriteIds.set(new Set([photos[0].id]));
    const fixture = TestBed.createComponent(PhotosPageComponent);
    fixture.detectChanges();

    const firstFavoriteIndicator = fixture.nativeElement.querySelector('.photo-card__favorite');

    expect(firstFavoriteIndicator.classList.contains('photo-card__favorite--active')).toBe(true);
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

  it('should restore the saved scroll position after view init', async () => {
    scrollPositionService.get.mockReturnValue(480);
    const scrollTo = vi.spyOn(window, 'scrollTo').mockImplementation(() => undefined);
    vi.spyOn(window, 'requestAnimationFrame').mockImplementation((callback) => {
      callback(0);

      return 1;
    });
    const fixture = TestBed.createComponent(PhotosPageComponent);

    fixture.detectChanges();
    await Promise.resolve();

    expect(scrollPositionService.get).toHaveBeenCalledWith('photos');
    expect(scrollTo).toHaveBeenCalledWith({
      top: 480,
      left: 0,
      behavior: 'instant',
    });
  });

  it('should save the scroll position on destroy', () => {
    Object.defineProperty(window, 'scrollY', {
      configurable: true,
      value: 360,
    });
    const fixture = TestBed.createComponent(PhotosPageComponent);
    fixture.detectChanges();

    fixture.destroy();

    expect(scrollPositionService.save).toHaveBeenCalledWith('photos', 360);
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
