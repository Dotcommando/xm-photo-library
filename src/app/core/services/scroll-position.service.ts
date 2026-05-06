import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ScrollPositionService {
  private readonly positionsState = signal<Record<string, number>>({});

  readonly positions = this.positionsState.asReadonly();

  save(key: string, position: number): void {
    this.positionsState.update((positions) => {
      return {
        ...positions,
        [key]: Math.max(0, Math.round(position)),
      };
    });
  }

  get(key: string): number {
    return this.positionsState()[key] ?? 0;
  }

  clear(key: string): void {
    this.positionsState.update((positions) => {
      const { [key]: _removedPosition, ...rest } = positions;

      return rest;
    });
  }
}
