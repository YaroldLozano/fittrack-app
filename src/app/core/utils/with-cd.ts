import { ChangeDetectorRef } from '@angular/core';

/**
 * On this project's Angular version, NgZone's automatic "zone stable ->
 * change detection" wiring does not reliably re-render a component after
 * an async callback (HttpClient subscribe, Preferences, etc.) mutates its
 * state — confirmed by direct testing: the state mutates correctly, but
 * the view is stale until change detection is forced manually. Wrap any
 * subscribe()/then() callback that mutates component state with this so
 * the view updates immediately afterwards.
 */
export function withCd<T>(cdr: ChangeDetectorRef, fn: (value: T) => void): (value: T) => void {
  return (value: T) => {
    fn(value);
    cdr.detectChanges();
  };
}
