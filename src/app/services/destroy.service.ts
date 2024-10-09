import { Injectable, OnDestroy } from '@angular/core';
import { Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class DestroyService extends Observable<void> implements OnDestroy {
  public readonly life$: Subject<void> = new Subject();

  constructor() {
    super(subscriber => this.life$.subscribe(subscriber));
  }

  ngOnDestroy(): void {
    console.log('DestroyService destroyed');
    this.life$.next();
    this.life$.complete();
  }
}
