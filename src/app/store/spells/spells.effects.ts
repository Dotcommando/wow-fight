import { Injectable } from '@angular/core';

import { Actions, createEffect, CreateEffectMetadata, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';

import { map, withLatestFrom } from 'rxjs/operators';

import { PHASE } from '../../constants/phase.constant';
import { setHitDamage, setSpellDamage } from '../damage/damage.actions';
import { selectDamage } from '../damage/damage.selectors';
import { applyHit, applySpellToCharacter, restoreFighterAfterSpell } from '../fighters/fighters.actions';
import { selectTurn } from '../turn/turn.selectors';
import {
  executeSpellsAfterMove,
  executeSpellsBeforeMove,
  reduceSpellCooldown,
} from './spells.actions';

@Injectable()
export class SpellsEffects {
  public reduceSpellCooldown$ = this.reduceSpellCooldownFn$();
  public setHitDamage$ = this.setHitDamageFn$();
  public restoreFighterAfterSpell$ = this.restoreFighterAfterSpellFn$();
  public setSpellDamage$ = this.setSpellDamageFn$();

  constructor(
    private actions$: Actions,
    private store: Store,
  ) {}

  private reduceSpellCooldownFn$(): CreateEffectMetadata {
    return createEffect(() => this.actions$.pipe(
      ofType(reduceSpellCooldown),
      withLatestFrom(this.store.select(selectTurn)),
      map(([ action, { phase } ]) => phase === PHASE.BEFORE_MOVE
        ? executeSpellsBeforeMove()
        : executeSpellsAfterMove(),
      ),
    ));
  }

  private restoreFighterAfterSpellFn$(): CreateEffectMetadata {
    return createEffect(() => this.actions$.pipe(
      ofType(restoreFighterAfterSpell),
      withLatestFrom(this.store.select(selectTurn)),
      map(([ action, { phase } ]) => phase === PHASE.BEFORE_MOVE
        ? executeSpellsBeforeMove()
        : executeSpellsAfterMove(),
      ),
    ));
  }

  private setHitDamageFn$(): CreateEffectMetadata {
    return createEffect(() => this.actions$.pipe(
      ofType(setHitDamage),
      withLatestFrom(
        this.store.select(selectDamage),
      ),
      map(([ action, damage ]) => {
        if (damage.damage > 0) {
          return applyHit({ ...damage.targetChanges });
        }

        return applyHit({ id: '', changes: {}});
      }),
    ));
  }

  private setSpellDamageFn$(): CreateEffectMetadata {
    return createEffect(() => this.actions$.pipe(
      ofType(setSpellDamage),
      withLatestFrom(
        this.store.select(selectDamage),
      ),
      map(([ action, damage ]) => applySpellToCharacter({ damage })),
    ));
  }
}
