import { DOCUMENT } from '@angular/common';
import { Injectable, inject } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class LocalStorageService {
  private readonly document = inject(DOCUMENT);

  get<T>(key: string): T | null {
    const storage = this.getStorage();
    const rawValue = storage?.getItem(key);

    if (!rawValue) {
      return null;
    }

    try {
      return JSON.parse(rawValue) as T;
    } catch {
      storage?.removeItem(key);
      return null;
    }
  }

  set<T>(key: string, value: T): void {
    this.getStorage()?.setItem(key, JSON.stringify(value));
  }

  remove(key: string): void {
    this.getStorage()?.removeItem(key);
  }

  private getStorage(): Storage | null {
    return this.document.defaultView?.localStorage ?? null;
  }
}
