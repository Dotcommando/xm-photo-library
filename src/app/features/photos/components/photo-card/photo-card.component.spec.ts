import { TestBed } from '@angular/core/testing';

import { IPhoto } from '../../../../core/models/photo.model';
import { PhotoCardComponent } from './photo-card.component';

describe('PhotoCardComponent', () => {
  const photo: IPhoto = {
    id: 'photo-1',
    seed: 'photo-1',
    thumbnailUrl: 'https://picsum.photos/seed/photo-1/200/300',
    fullUrl: 'https://picsum.photos/seed/photo-1/1200/1800',
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PhotoCardComponent],
    }).compileComponents();
  });

  it('should render the photo thumbnail', () => {
    const fixture = TestBed.createComponent(PhotoCardComponent);
    fixture.componentRef.setInput('photo', photo);
    fixture.detectChanges();

    const image = fixture.nativeElement.querySelector('img') as HTMLImageElement;

    expect(image.getAttribute('src')).toBe(photo.thumbnailUrl);
    expect(image.getAttribute('alt')).toBe(`Photo ${photo.seed}`);
  });

  it('should render the favorite indicator', () => {
    const fixture = TestBed.createComponent(PhotoCardComponent);
    fixture.componentRef.setInput('photo', photo);
    fixture.detectChanges();

    const favoriteIndicator = fixture.nativeElement.querySelector(
      '.photo-card__favorite',
    ) as HTMLElement;

    expect(favoriteIndicator).toBeTruthy();
    expect(favoriteIndicator.tagName.toLowerCase()).toBe('span');
    expect(favoriteIndicator.querySelector('mat-icon')?.textContent?.trim()).toBe(
      'favorite_border',
    );
  });

  it('should highlight the favorite indicator when the photo is favorite', () => {
    const fixture = TestBed.createComponent(PhotoCardComponent);
    fixture.componentRef.setInput('photo', photo);
    fixture.componentRef.setInput('favorite', true);
    fixture.detectChanges();

    const favoriteIndicator = fixture.nativeElement.querySelector('.photo-card__favorite');
    const icon = favoriteIndicator.querySelector('mat-icon') as HTMLElement;

    expect(favoriteIndicator.classList.contains('photo-card__favorite--active')).toBe(true);
    expect(icon.textContent?.trim()).toBe('favorite');
  });

  it('should emit the selected photo when the card is clicked', () => {
    const fixture = TestBed.createComponent(PhotoCardComponent);
    const selected = vi.fn();
    fixture.componentRef.setInput('photo', photo);
    fixture.componentInstance.photoSelected.subscribe(selected);
    fixture.detectChanges();

    const card = fixture.nativeElement.querySelector('.photo-card') as HTMLButtonElement;
    card.click();

    expect(selected).toHaveBeenCalledWith(photo);
  });
});
