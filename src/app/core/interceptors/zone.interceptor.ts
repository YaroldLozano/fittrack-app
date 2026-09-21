import { ApplicationRef, inject, NgZone } from '@angular/core';
import { HttpInterceptorFn } from '@angular/common/http';
import { Observable } from 'rxjs';

/**
 * On this project's Angular version, NgZone's automatic "zone stable ->
 * ApplicationRef.tick()" wiring does not fire reliably for HttpClient
 * responses (confirmed: subscribe() callbacks run and mutate component
 * state, but the view never re-renders until change detection is forced
 * manually). Re-entering the zone alone isn't enough, so this explicitly
 * calls tick() after every HTTP emission as a safety net.
 */
export const zoneInterceptor: HttpInterceptorFn = (req, next) => {
  const ngZone = inject(NgZone);
  const appRef = inject(ApplicationRef);

  const runAndTick = (fn: () => void) => {
    ngZone.run(fn);
    if (!appRef.destroyed) {
      appRef.tick();
    }
  };

  return new Observable((subscriber) => {
    const subscription = next(req).subscribe({
      next: (event) => runAndTick(() => subscriber.next(event)),
      error: (err) => runAndTick(() => subscriber.error(err)),
      complete: () => runAndTick(() => subscriber.complete()),
    });

    return () => subscription.unsubscribe();
  });
};
