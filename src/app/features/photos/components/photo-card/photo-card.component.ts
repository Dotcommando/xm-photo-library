import { Component, input, output } from '@angular/core';

import { IPhoto } from '../../../../core/models/photo.model';

@Component({
  selector: 'app-photo-card',
  templateUrl: './photo-card.component.html',
  styleUrl: './photo-card.component.scss',
})
export class PhotoCardComponent {
  readonly photo = input.required<IPhoto>();
  readonly favorite = input(false);
  readonly photoSelected = output<IPhoto>();

  protected selectPhoto(): void {
    this.photoSelected.emit(this.photo());
  }
}
