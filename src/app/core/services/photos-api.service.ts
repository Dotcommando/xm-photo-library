import { Injectable } from '@angular/core';
import { Observable, delay, of } from 'rxjs';

import { IPhoto, IPhotosPage } from '../models/photo.model';

export interface IGetPhotosParams {
  offset: number;
  limit: number;
}

@Injectable({
  providedIn: 'root',
})
export class PhotosApiService {
  getPhotos(params: IGetPhotosParams): Observable<IPhotosPage> {
    const items: IPhoto[] = Array.from({ length: params.limit }, (_, index) => {
      const seed = `${params.offset + index}-${crypto.randomUUID()}`;

      return {
        id: seed,
        seed,
        thumbnailUrl: `https://picsum.photos/seed/${seed}/200/300`,
        fullUrl: `https://picsum.photos/seed/${seed}/1200/1800`,
      };
    });

    return of({
      items,
      nextOffset: params.offset + params.limit,
    }).pipe(delay(this.getRandomDelay()));
  }

  private getRandomDelay(): number {
    return Math.floor(Math.random() * 101) + 200;
  }
}
