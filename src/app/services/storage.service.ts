import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class StorageService {
  public set(name: string, value: string | number | boolean) {
    window.localStorage.setItem(name, `${value}`);
  }

  public get(name: string): boolean {
    return window.localStorage.getItem(name) === 'true';
  }
}
