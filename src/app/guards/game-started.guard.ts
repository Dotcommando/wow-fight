import { Injectable } from '@angular/core';
import { CanActivate, Router, UrlTree } from '@angular/router';

import { Store } from '@ngrx/store';

import { Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';

import { selectRoundNumber } from '../store/turn/turn.selectors';

@Injectable({
  providedIn: 'root',
})
export class GameStartedGuard implements CanActivate {
  constructor(private store: Store, private router: Router) {}

  canActivate(): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    return this.store.select(selectRoundNumber)
      .pipe(
        tap((roundNumber) => {
          if (roundNumber < 1) this.router.navigate(['/']);
        }),
        map(roundNumber => roundNumber > 0),
      );
  }
}
