import { Component, input } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';

import { IPhoto } from '../../../../core/models/photo.model';

@Component({
  selector: 'app-photo-card',
  imports: [MatButtonModule],
  templateUrl: './photo-card.component.html',
  styleUrl: './photo-card.component.scss',
})
export class PhotoCardComponent {
  readonly photo = input.required<IPhoto>();
}
