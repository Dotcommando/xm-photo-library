import { TestBed } from '@angular/core/testing';

import { LocalStorageService } from './local-storage.service';

describe('LocalStorageService', () => {
  const storageKey = 'xm-photo-library-local-storage-test';
  let service: LocalStorageService;

  beforeEach(() => {
    window.localStorage.removeItem(storageKey);
    TestBed.configureTestingModule({});
    service = TestBed.inject(LocalStorageService);
  });

  afterEach(() => {
    window.localStorage.removeItem(storageKey);
  });

  it('should create', () => {
    expect(service).toBeTruthy();
  });

  it('should store and read JSON values', () => {
    const value = [{ id: 'photo-1' }];

    service.set(storageKey, value);

    expect(service.get(storageKey)).toEqual(value);
  });

  it('should return null when the key is missing', () => {
    expect(service.get(storageKey)).toBeNull();
  });

  it('should remove invalid JSON and return null', () => {
    window.localStorage.setItem(storageKey, '{broken');

    expect(service.get(storageKey)).toBeNull();
    expect(window.localStorage.getItem(storageKey)).toBeNull();
  });

  it('should remove a stored value', () => {
    service.set(storageKey, { id: 'photo-1' });

    service.remove(storageKey);

    expect(service.get(storageKey)).toBeNull();
  });
});
