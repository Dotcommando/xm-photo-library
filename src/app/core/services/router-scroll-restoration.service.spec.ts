import { DOCUMENT } from '@angular/common';
import { TestBed } from '@angular/core/testing';
import { NavigationEnd, NavigationStart, Router } from '@angular/router';
import { Subject } from 'rxjs';

import { ScrollPositionService } from './scroll-position.service';
import { RouterScrollRestorationService } from './router-scroll-restoration.service';

describe('RouterScrollRestorationService', () => {
  let events$: Subject<NavigationStart | NavigationEnd>;
  let scrollPositionService: {
    get: ReturnType<typeof vi.fn>;
    save: ReturnType<typeof vi.fn>;
  };
  let windowRef: {
    requestAnimationFrame: ReturnType<typeof vi.fn>;
    scrollTo: ReturnType<typeof vi.fn>;
    scrollY: number;
  };

  beforeEach(() => {
    events$ = new Subject<NavigationStart | NavigationEnd>();
    scrollPositionService = {
      get: vi.fn().mockReturnValue(0),
      save: vi.fn(),
    };
    windowRef = {
      requestAnimationFrame: vi.fn((callback: FrameRequestCallback) => {
        callback(0);

        return 1;
      }),
      scrollTo: vi.fn(),
      scrollY: 0,
    };

    TestBed.configureTestingModule({
      providers: [
        {
          provide: DOCUMENT,
          useValue: {
            defaultView: windowRef,
          },
        },
        {
          provide: Router,
          useValue: {
            events: events$,
            url: '/',
          },
        },
        { provide: ScrollPositionService, useValue: scrollPositionService },
      ],
    });
  });

  it('should create', () => {
    const service = TestBed.inject(RouterScrollRestorationService);

    expect(service).toBeTruthy();
  });

  it('should save the current page scroll position on navigation start', () => {
    TestBed.inject(RouterScrollRestorationService);
    windowRef.scrollY = 640;

    events$.next(new NavigationStart(1, '/favorites'));

    expect(scrollPositionService.save).toHaveBeenCalledWith('/', 640);
  });

  it('should restore the target page scroll position on navigation end', async () => {
    scrollPositionService.get.mockReturnValue(360);
    TestBed.inject(RouterScrollRestorationService);

    events$.next(new NavigationEnd(1, '/favorites', '/favorites'));
    await Promise.resolve();

    expect(scrollPositionService.get).toHaveBeenCalledWith('/favorites');
    expect(windowRef.scrollTo).toHaveBeenCalledWith({
      top: 360,
      left: 0,
      behavior: 'instant',
    });
  });

  it('should keep independent positions for each URL', async () => {
    TestBed.inject(RouterScrollRestorationService);
    windowRef.scrollY = 500;

    events$.next(new NavigationStart(1, '/favorites'));
    events$.next(new NavigationEnd(1, '/favorites', '/favorites'));
    windowRef.scrollY = 120;
    events$.next(new NavigationStart(2, '/photos/photo-1'));
    events$.next(new NavigationEnd(2, '/photos/photo-1', '/photos/photo-1'));
    await Promise.resolve();

    expect(scrollPositionService.save).toHaveBeenNthCalledWith(1, '/', 500);
    expect(scrollPositionService.save).toHaveBeenNthCalledWith(2, '/favorites', 120);
    expect(scrollPositionService.get).toHaveBeenCalledWith('/favorites');
    expect(scrollPositionService.get).toHaveBeenCalledWith('/photos/photo-1');
  });
});
