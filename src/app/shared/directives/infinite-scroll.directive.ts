import { DOCUMENT } from '@angular/common';
import {
  Directive,
  ElementRef,
  NgZone,
  OnDestroy,
  OnInit,
  effect,
  inject,
  input,
  output,
} from '@angular/core';

@Directive({
  selector: '[appInfiniteScroll]',
})
export class InfiniteScrollDirective implements OnInit, OnDestroy {
  readonly rootMargin = input('320px', { alias: 'appInfiniteScrollRootMargin' });
  readonly disabled = input(false, { alias: 'appInfiniteScrollDisabled' });
  readonly reached = output<void>({ alias: 'appInfiniteScrollReached' });

  private readonly document = inject(DOCUMENT);
  private readonly elementRef = inject<ElementRef<HTMLElement>>(ElementRef);
  private readonly ngZone = inject(NgZone);
  private observer: IntersectionObserver | null = null;

  constructor() {
    effect(() => {
      this.rootMargin();

      if (this.observer) {
        this.observeAnchor();
      }
    });
  }

  ngOnInit(): void {
    const windowRef = this.document.defaultView;

    if (!windowRef || !windowRef.IntersectionObserver) {
      return;
    }

    this.ngZone.runOutsideAngular(() => {
      this.observeAnchor();
    });
  }

  ngOnDestroy(): void {
    this.observer?.disconnect();
  }

  private observeAnchor(): void {
    const windowRef = this.document.defaultView;

    if (!windowRef || !windowRef.IntersectionObserver) {
      return;
    }

    this.observer?.disconnect();
    this.observer = new windowRef.IntersectionObserver(
      (entries) => {
        const isReached = entries.some((entry) => entry.isIntersecting);

        if (isReached && !this.disabled()) {
          this.ngZone.run(() => this.reached.emit());
        }
      },
      {
        root: null,
        rootMargin: this.rootMargin(),
        threshold: 0,
      },
    );

    this.observer.observe(this.elementRef.nativeElement);
  }
}
