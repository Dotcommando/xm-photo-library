import { DOCUMENT } from '@angular/common';
import { Injectable, inject } from '@angular/core';
import { NavigationEnd, NavigationStart, Router } from '@angular/router';

import { ScrollPositionService } from './scroll-position.service';

@Injectable({
  providedIn: 'root',
})
export class RouterScrollRestorationService {
  private readonly document = inject(DOCUMENT);
  private readonly router = inject(Router);
  private readonly scrollPositionService = inject(ScrollPositionService);
  private currentUrl = this.router.url;

  constructor() {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationStart) {
        this.saveCurrentPosition();
      }

      if (event instanceof NavigationEnd) {
        this.currentUrl = event.urlAfterRedirects;
        this.restorePosition(this.currentUrl);
      }
    });
  }

  private saveCurrentPosition(): void {
    const windowRef = this.document.defaultView;

    if (!windowRef) {
      return;
    }

    this.scrollPositionService.save(this.currentUrl, windowRef.scrollY);
  }

  private restorePosition(url: string): void {
    const windowRef = this.document.defaultView;

    if (!windowRef) {
      return;
    }

    const position = this.scrollPositionService.get(url);

    queueMicrotask(() => {
      windowRef.requestAnimationFrame(() => {
        windowRef.scrollTo({
          top: position,
          left: 0,
          behavior: 'instant',
        });
      });
    });
  }
}
