import { Injectable } from '@angular/core';

import { Actions, createEffect, CreateEffectMetadata, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';

import { map, withLatestFrom } from 'rxjs/operators';

import { findNextFighter } from '../../helpers/find-next-fighter.helper';
import { BattleService } from '../../services/battle.service';
import { reduceSpellExpiration } from '../spells/spells.actions';
import { nextTurn, phaseBeforeMove, phaseMoving, turnChangeNextFighter } from '../turn/turn.actions';
import { selectTurn } from '../turn/turn.selectors';
import { applySpellToCharacter, moveCompleted, moveStarted, updateCharacter } from './fighters.actions';
import { selectCharacters, selectParties } from './fighters.selectors';

@Injectable()
export class FightersEffects {
  public moveStarted$ = this.moveStartedFn$();
  public beforeMove$ = this.beforeMoveFn$();
  public applySpellToCharacter$ = this.applySpellToCharacterFn$();
  public moveCompleted$ = this.moveCompletedFn$();

  constructor(
    private actions$: Actions,
    private store: Store,
    private battleService: BattleService,
  ) {}

  private moveStartedFn$(): CreateEffectMetadata {
    return createEffect(() => this.actions$.pipe(
      ofType(moveStarted),
      map(() => phaseBeforeMove()),
    ));
  }

  private beforeMoveFn$(): CreateEffectMetadata {
    return createEffect(() => this.actions$.pipe(
      ofType(phaseBeforeMove),
      map(() => phaseMoving()),
    ));
  }

  private applySpellToCharacterFn$(): CreateEffectMetadata {
    return createEffect(() => this.actions$.pipe(
      ofType(applySpellToCharacter),
      map(action => reduceSpellExpiration({ spellId: action.spell.id })),
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
      // map(([ action, fighters, turn ]) => {
      //   const movingFighter = fighters.find(fighter => fighter.id === turn.movingFighter);
      //
      //   return updateCharacter({ id: movingFighter.id, changes: { move: MOVE_STATUSES.MOVED }});
      // }),
      map(([ action, fighters, parties, turn ]) => {
        const nextFighter = findNextFighter(fighters, parties);

        console.log('nextFighter');
        console.log(nextFighter);

        return nextFighter
          ? turnChangeNextFighter({ nextFighterId: nextFighter.id, nextPartyId: nextFighter.partyId })
          : nextTurn();
      }),
    ));
  }
}
