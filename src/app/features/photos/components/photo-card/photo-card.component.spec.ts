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

  it('should render a disabled favorite icon', () => {
    const fixture = TestBed.createComponent(PhotoCardComponent);
    fixture.componentRef.setInput('photo', photo);
    fixture.detectChanges();

    const favoriteButton = fixture.nativeElement.querySelector(
      '.photo-card__favorite',
    ) as HTMLButtonElement;

    expect(favoriteButton).toBeTruthy();
    expect(favoriteButton.disabled).toBe(true);
    expect(favoriteButton.querySelector('svg')).toBeTruthy();
  });
});
