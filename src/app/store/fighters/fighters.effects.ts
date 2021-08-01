import { Injectable } from '@angular/core';

import { Actions, createEffect, CreateEffectMetadata, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';

import { mergeMap, withLatestFrom } from 'rxjs/operators';

import { MOVE_STATUSES } from '../../constants/move-statuses.enum';
import { findNextFighter } from '../../helpers/find-next-fighter.helper';
import { resetAttackVectors } from '../attackVectors/attack-vectors.actions';
import { resetDamage } from '../damage/damage.actions';
import { reduceSpellExpiration } from '../spells/spells.actions';
import { turnChangeNextFighter, turnCompleted } from '../turn/turn.actions';
import { selectTurn } from '../turn/turn.selectors';
import { applySpellToCharacter, moveCompleted, updateCharacters } from './fighters.actions';
import { selectCharacters, selectParties } from './fighters.selectors';

@Injectable()
export class FightersEffects {
  public applySpellToCharacter$ = this.applySpellToCharacterFn$();
  public moveCompleted$ = this.moveCompletedFn$();

  constructor(
    private actions$: Actions,
    private store: Store,
  ) {}

  private applySpellToCharacterFn$(): CreateEffectMetadata {
    return createEffect(() => this.actions$.pipe(
      ofType(applySpellToCharacter),
      mergeMap(action => [
        reduceSpellExpiration({ spellId: action.damage.spellId }),
        resetDamage(),
      ]),
    ));
  }

  private moveCompletedFn$(): CreateEffectMetadata {
    return createEffect(() => this.actions$.pipe(
      ofType(moveCompleted),
      withLatestFrom(
        this.store.select(selectCharacters),
        this.store.select(selectParties),
        this.store.select(selectTurn),
      ),
      mergeMap(([ action, fighters, parties, turn ]) => {
        const currentFighterId = turn.movingFighter;
        const nextFighter = findNextFighter(fighters, parties);

        if (nextFighter) {
          return [
            updateCharacters({
              changes: [
                { id: currentFighterId, changes: { move: MOVE_STATUSES.MOVED }},
                { id: nextFighter.id, changes: { move: MOVE_STATUSES.MOVING }},
              ],
            }),
            turnChangeNextFighter({ nextFighterId: nextFighter.id, nextPartyId: nextFighter.partyId }),
            resetAttackVectors(),
            resetDamage(),
          ];
        }

        return [
          updateCharacters({
            changes: [
              { id: currentFighterId, changes: { move: MOVE_STATUSES.MOVED }},
            ],
          }),
          turnCompleted(),
          resetAttackVectors(),
          resetDamage(),
        ];
      }),
    ));
  }
}
