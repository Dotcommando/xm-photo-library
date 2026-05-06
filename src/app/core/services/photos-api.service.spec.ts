import { TestBed } from '@angular/core/testing';

import { IPhotosPage } from '../models/photo.model';
import { PhotosApiService } from './photos-api.service';

describe('PhotosApiService', () => {
  let service: PhotosApiService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PhotosApiService);
  });

  afterEach(() => {
    vi.restoreAllMocks();
    vi.useRealTimers();
  });

  it('should create', () => {
    expect(service).toBeTruthy();
  });

  it('should return a generated photos page after the API delay', async () => {
    vi.useFakeTimers();
    vi.spyOn(crypto, 'randomUUID')
      .mockReturnValueOnce('00000000-0000-4000-8000-000000000001')
      .mockReturnValueOnce('00000000-0000-4000-8000-000000000002');
    vi.spyOn(
      service as unknown as { getRandomDelay: () => number },
      'getRandomDelay',
    ).mockReturnValue(200);

    let result: IPhotosPage | undefined;

    service.getPhotos({ offset: 4, limit: 2 }).subscribe((page) => {
      result = page;
    });

    await vi.advanceTimersByTimeAsync(199);
    expect(result).toBeUndefined();

    await vi.advanceTimersByTimeAsync(1);
    expect(result).toEqual({
      items: [
        {
          id: '4-00000000-0000-4000-8000-000000000001',
          seed: '4-00000000-0000-4000-8000-000000000001',
          thumbnailUrl: 'https://picsum.photos/seed/4-00000000-0000-4000-8000-000000000001/200/300',
          fullUrl: 'https://picsum.photos/seed/4-00000000-0000-4000-8000-000000000001/1200/1800',
        },
        {
          id: '5-00000000-0000-4000-8000-000000000002',
          seed: '5-00000000-0000-4000-8000-000000000002',
          thumbnailUrl: 'https://picsum.photos/seed/5-00000000-0000-4000-8000-000000000002/200/300',
          fullUrl: 'https://picsum.photos/seed/5-00000000-0000-4000-8000-000000000002/1200/1800',
        },
      ],
      nextOffset: 6,
    });
  });

  it('should use a random delay from 200ms to 300ms', async () => {
    vi.useFakeTimers();
    vi.spyOn(crypto, 'randomUUID').mockReturnValue('00000000-0000-4000-8000-000000000001');

    let result: IPhotosPage | undefined;

    service.getPhotos({ offset: 0, limit: 1 }).subscribe((page) => {
      result = page;
    });

    await vi.advanceTimersByTimeAsync(199);
    expect(result).toBeUndefined();

    await vi.advanceTimersByTimeAsync(101);
    expect(result).toBeDefined();
  });
});
