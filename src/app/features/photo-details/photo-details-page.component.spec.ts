import { signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { ActivatedRoute, Router } from '@angular/router';

import { IPhoto } from '../../core/models/photo.model';
import { FavoritesStoreService } from '../../core/services/favorites-store.service';
import { PhotoDetailsPageComponent } from './photo-details-page.component';

describe('PhotoDetailsPageComponent', () => {
  const photo = createPhoto('photo-1');

  let favoritesStore: {
    favorites: ReturnType<typeof signal<IPhoto[]>>;
    findById: ReturnType<typeof vi.fn>;
    remove: ReturnType<typeof vi.fn>;
  };
  let router: {
    navigateByUrl: ReturnType<typeof vi.fn>;
  };

  beforeEach(async () => {
    favoritesStore = {
      favorites: signal([photo]),
      findById: vi.fn().mockReturnValue(photo),
      remove: vi.fn(),
    };
    router = {
      navigateByUrl: vi.fn(),
    };

    await TestBed.configureTestingModule({
      imports: [PhotoDetailsPageComponent],
      providers: [
        { provide: ActivatedRoute, useValue: createActivatedRoute(photo.id) },
        { provide: FavoritesStoreService, useValue: favoritesStore },
        { provide: Router, useValue: router },
      ],
    }).compileComponents();
  });

  it('should render the selected favorite photo', () => {
    const fixture = TestBed.createComponent(PhotoDetailsPageComponent);

    fixture.detectChanges();

    const image = fixture.nativeElement.querySelector('img') as HTMLImageElement;
    const removeButton = fixture.nativeElement.querySelector(
      '.photo-page__remove',
    ) as HTMLButtonElement;

    expect(favoritesStore.findById).toHaveBeenCalledWith(photo.id);
    expect(image.getAttribute('src')).toBe(photo.fullUrl);
    expect(image.getAttribute('alt')).toBe(`Photo ${photo.seed}`);
    expect(image.compareDocumentPosition(removeButton) & Node.DOCUMENT_POSITION_FOLLOWING).toBe(
      Node.DOCUMENT_POSITION_FOLLOWING,
    );
  });

  it('should remove the photo from favorites and navigate back to favorites', () => {
    const fixture = TestBed.createComponent(PhotoDetailsPageComponent);
    fixture.detectChanges();

    const removeButton = fixture.nativeElement.querySelector(
      '.photo-page__remove',
    ) as HTMLButtonElement;
    removeButton.click();

    expect(favoritesStore.remove).toHaveBeenCalledWith(photo.id);
    expect(router.navigateByUrl).toHaveBeenCalledWith('/favorites');
  });

  it('should render an empty state when the photo is not found', () => {
    favoritesStore.findById.mockReturnValue(undefined);
    const fixture = TestBed.createComponent(PhotoDetailsPageComponent);

    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('img')).toBeFalsy();
    expect(fixture.nativeElement.querySelector('.photo-page__empty')?.textContent?.trim()).toBe(
      'Photo was not found in favorites.',
    );
  });
});

function createActivatedRoute(photoId: string): Pick<ActivatedRoute, 'snapshot'> {
  return {
    snapshot: {
      paramMap: {
        get: (key: string) => (key === 'id' ? photoId : null),
      },
    } as ActivatedRoute['snapshot'],
  };
}

function createPhoto(id: string): IPhoto {
  return {
    id,
    seed: id,
    thumbnailUrl: `https://picsum.photos/seed/${id}/200/300`,
    fullUrl: `https://picsum.photos/seed/${id}/1200/1800`,
  };
}
