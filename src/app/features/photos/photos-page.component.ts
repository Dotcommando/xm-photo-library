import { Component, OnInit, inject } from '@angular/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { PhotosStoreService } from '../../core/services/photos-store.service';
import { PhotoCardComponent } from './components/photo-card/photo-card.component';

@Component({
  selector: 'app-photos-page',
  imports: [MatProgressSpinnerModule, PhotoCardComponent],
  templateUrl: './photos-page.component.html',
  styleUrl: './photos-page.component.scss',
})
export class PhotosPageComponent implements OnInit {
  protected readonly photosStore = inject(PhotosStoreService);

  ngOnInit(): void {
    if (this.photosStore.photos().length === 0) {
      this.photosStore.loadNextPage();
    }
  }
}
