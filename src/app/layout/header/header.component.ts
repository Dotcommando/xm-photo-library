import { Component, computed, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { NavigationEnd, Router, RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { filter } from 'rxjs';

@Component({
  selector: 'app-header',
  imports: [MatButtonModule, MatToolbarModule, RouterLink],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
})
export class HeaderComponent {
  private readonly router = inject(Router);
  private readonly currentUrl = signal(this.router.url);

  protected readonly photosActive = computed(() => {
    return this.currentUrl() === '/';
  });

  protected readonly favoritesActive = computed(() => {
    const url = this.currentUrl();

    return url === '/favorites' || url.startsWith('/photos/');
  });

  constructor() {
    this.router.events
      .pipe(
        filter((event) => event instanceof NavigationEnd),
        takeUntilDestroyed(),
      )
      .subscribe((event) => {
        this.currentUrl.set(event.urlAfterRedirects);
      });
  }
}
