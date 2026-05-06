import { Routes } from '@angular/router';
import { FavoritesPageComponent } from './features/favorites/favorites-page.component';
import { PhotosPageComponent } from './features/photos/photos-page.component';

export const routes: Routes = [
  {
    path: '',
    component: PhotosPageComponent,
    title: 'Photos',
  },
  {
    path: 'favorites',
    component: FavoritesPageComponent,
    title: 'Favorites',
  },
  {
    path: '**',
    redirectTo: '',
  },
];
