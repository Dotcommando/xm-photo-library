import { Component, signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InfiniteScrollDirective } from './infinite-scroll.directive';

type ObserverCallback = IntersectionObserverCallback;

@Component({
  imports: [InfiniteScrollDirective],
  template: `
    <div
      appInfiniteScroll
      [appInfiniteScrollDisabled]="disabled()"
      [appInfiniteScrollRootMargin]="rootMargin()"
      (appInfiniteScrollReached)="onReached()"
    ></div>
  `,
})
class InfiniteScrollHostComponent {
  readonly rootMargin = signal('100px');
  readonly disabled = signal(false);
  readonly reached = vi.fn();

  onReached(): void {
    this.reached();
  }
}

describe('InfiniteScrollDirective', () => {
  const originalIntersectionObserver = window.IntersectionObserver;
  let fixture: ComponentFixture<InfiniteScrollHostComponent>;
  let component: InfiniteScrollHostComponent;
  let observerInstances: IntersectionObserverMock[];

  beforeEach(async () => {
    observerInstances = [];
    window.IntersectionObserver = class extends IntersectionObserverMock {
      constructor(callback: ObserverCallback, options?: IntersectionObserverInit) {
        super(callback, options);
        observerInstances.push(this);
      }
    } as unknown as typeof IntersectionObserver;

    await TestBed.configureTestingModule({
      imports: [InfiniteScrollHostComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(InfiniteScrollHostComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => {
    window.IntersectionObserver = originalIntersectionObserver;
    vi.restoreAllMocks();
  });

  it('should observe the host element with the configured root margin', () => {
    const hostElement = fixture.nativeElement.querySelector('div') as HTMLElement;
    const observer = observerInstances.at(-1);

    expect(observer).toBeTruthy();
    expect(observer?.options).toEqual({ root: null, rootMargin: '100px', threshold: 0 });
    expect(observer?.observedElement).toBe(hostElement);
  });

  it('should emit when the anchor intersects', () => {
    observerInstances.at(-1)?.emit(true);

    expect(component.reached).toHaveBeenCalledOnce();
  });

  it('should not emit when the anchor does not intersect', () => {
    observerInstances.at(-1)?.emit(false);

    expect(component.reached).not.toHaveBeenCalled();
  });

  it('should not emit when disabled', () => {
    component.disabled.set(true);
    fixture.detectChanges();

    observerInstances.at(-1)?.emit(true);

    expect(component.reached).not.toHaveBeenCalled();
  });

  it('should recreate the observer when the root margin changes', () => {
    const firstObserver = observerInstances.at(-1);

    component.rootMargin.set('480px');
    fixture.detectChanges();

    const secondObserver = observerInstances.at(-1);

    expect(firstObserver?.disconnected).toBe(true);
    expect(secondObserver).not.toBe(firstObserver);
    expect(secondObserver?.options?.rootMargin).toBe('480px');
  });
});

class IntersectionObserverMock {
  observedElement: Element | null = null;
  disconnected = false;

  constructor(
    private readonly callback: ObserverCallback,
    readonly options?: IntersectionObserverInit,
  ) {}

  observe(element: Element): void {
    this.observedElement = element;
  }

  disconnect(): void {
    this.disconnected = true;
  }

  emit(isIntersecting: boolean): void {
    this.callback(
      [
        {
          isIntersecting,
        } as IntersectionObserverEntry,
      ],
      this as unknown as IntersectionObserver,
    );
  }
}
