import { Injectable } from '@angular/core';

import { Actions, createEffect, CreateEffectMetadata, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';

import { interval, of } from 'rxjs';
import { delayWhen, map, withLatestFrom } from 'rxjs/operators';

import { STATUSES } from '../../constants/statuses.enum';
import { selectCharacters } from '../fighters/fighters.selectors';
import { phaseMoving, phasePlayerMoving } from '../turn/turn.actions';
import { selectTurn } from '../turn/turn.selectors';
import { setAttackVectors } from './attack-vectors.actions';

@Injectable()
export class AttackVectorsEffects {
  public setAttackVectors$ = this.setAttackVectorsFn$();

  constructor(
    private actions$: Actions,
    private store: Store,
  ) {
  }

  private setAttackVectorsFn$(): CreateEffectMetadata {
    return createEffect(() => this.actions$.pipe(
      ofType(setAttackVectors),
      withLatestFrom(
        this.store.select(selectTurn),
        this.store.select(selectCharacters),
      ),
      delayWhen(([ action, turn, fighters ]) => fighters.find(fighter => fighter.id === turn.movingFighter).status !== STATUSES.PLAYER
        ? interval(3000)
        : of([ action, turn, fighters ]),
      ),
      map(([ action, { movingFighter }, fighters ]) =>
        fighters.find(fighter => fighter.id === movingFighter).status === STATUSES.PLAYER
          ? phasePlayerMoving()
          : phaseMoving(),
      ),
    ));
  }
}
