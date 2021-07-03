import { Injectable } from '@angular/core';

import { Actions, createEffect, CreateEffectMetadata, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';

import { of } from 'rxjs';
import { map, mergeMap, withLatestFrom } from 'rxjs/operators';

import { IBeastCharacter, IMainCharacter, InstanceOf } from '../../models/character.type';
import { turnActiveFighterChanging, turnPhaseChanging } from '../turn/turn.actions';
import { moveStarted, nextFighter } from './fighters.actions';
import { selectAllCharacters } from './fighters.reducer';
import { PHASE } from '../../constants/phase.constant';

@Injectable()
export class FightersEffects {
  // public nextFighter$ = this.nextFighterFn$();
  public moveStarted$ = this.moveStartedFn$();

  constructor(
    private actions$: Actions,
    private store: Store,
  ) {}

  private moveStartedFn$(): CreateEffectMetadata {
    return createEffect(() => this.actions$.pipe(
      ofType(moveStarted),
      map(() => turnPhaseChanging({ phase: PHASE.BEFORE_MOVE })),
    ));
  }

  // private nextFighterFn$(): CreateEffectMetadata {
  //   return createEffect(() => this.actions$.pipe(
  //     ofType(nextFighter),
  //     withLatestFrom(this.store.select(selectAllCharacters)),
  //     mergeMap(
  //       (fighters: InstanceOf<IMainCharacter | IBeastCharacter>[]) => of(true)
  //         .pipe(
  //           map(() => turnActiveFighterChanging({ activeFighterId: next }),
  //           ),
  //         ),
  //     ),
  //   ));
  // }
}
