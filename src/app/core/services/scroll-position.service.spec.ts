import { TestBed } from '@angular/core/testing';

import { ScrollPositionService } from './scroll-position.service';

describe('ScrollPositionService', () => {
  let service: ScrollPositionService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ScrollPositionService);
  });

  it('should create', () => {
    expect(service).toBeTruthy();
  });

  it('should save and return a scroll position by key', () => {
    service.save('photos', 246.6);

    expect(service.get('photos')).toBe(247);
    expect(service.positions()).toEqual({ photos: 247 });
  });

  it('should return zero for missing positions', () => {
    expect(service.get('missing')).toBe(0);
  });

  it('should not save negative positions', () => {
    service.save('photos', -30);

    expect(service.get('photos')).toBe(0);
  });

  it('should clear a saved position', () => {
    service.save('photos', 120);
    service.save('favorites', 80);

    service.clear('photos');

    expect(service.get('photos')).toBe(0);
    expect(service.positions()).toEqual({ favorites: 80 });
  });
});
