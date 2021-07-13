import { Injectable } from '@angular/core';

import { Actions, createEffect, CreateEffectMetadata, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';

import { map, withLatestFrom } from 'rxjs/operators';

import { PHASE } from '../../constants/phase.constant';
import { BattleService } from '../../services/battle.service';
import { selectAttack } from '../attacks/attacks.selectors';
import { applyHit, moveCompleted } from '../fighters/fighters.actions';
import { selectCharacters, selectParties } from '../fighters/fighters.selectors';
import { selectTurn } from '../turn/turn.selectors';
import { executeHit, executeSpells, executeSpellsAfterMove, executeSpellsBeforeMove, reduceSpellExpiration } from './spells.actions';
import { selectSpells } from './spells.selectors';

@Injectable()
export class SpellsEffects {
  public executeSpells$ = this.executeSpellsFn$();
  public reduceSpellExpiration$ = this.reduceSpellExpirationFn$();
  public executeHit$ = this.executeHitFn$();
  public applyHit$ = this.applyHitFn$();

  constructor(
    private actions$: Actions,
    private store: Store,
    private battleService: BattleService,
  ) {}

  private executeSpellsFn$(): CreateEffectMetadata {
    return createEffect(() => this.actions$.pipe(
      ofType(executeSpells),
      withLatestFrom(
        this.store.select(selectCharacters),
        this.store.select(selectParties),
        this.store.select(selectSpells),
        this.store.select(selectTurn),
        this.store.select(selectAttack),
      ),
      // tap(([ action, characters, parties, spells, currentTurn, attack ]) => this.battleService
      //   .pushSpellsLoop({ characters, parties, spells, currentTurn, attack })),
    ), { dispatch: false });
  }

  private reduceSpellExpirationFn$(): CreateEffectMetadata {
    return createEffect(() => this.actions$.pipe(
      ofType(reduceSpellExpiration),
      withLatestFrom(this.store.select(selectTurn)),
      map(([ action, { phase } ]) => phase === PHASE.BEFORE_MOVE
        ? executeSpellsBeforeMove()
        : executeSpellsAfterMove(),
      ),
    ));
  }

  private executeHitFn$(): CreateEffectMetadata {
    return createEffect(() => this.actions$.pipe(
      ofType(executeHit),
      withLatestFrom(
        this.store.select(selectAttack),
        this.store.select(selectCharacters),
      ),
      map(([ action, attack, fighters ]) => {
        if (attack.hit) {
          const fighter = fighters.find(fighter => fighter.id === attack.target.id);
          const assaulter = fighters.find(fighter => fighter.id === attack.assaulter.id);

          const resultHp = fighter.hp - assaulter.dps;
          const isAlive = resultHp > 0;

          return applyHit({ id: fighter.id, changes: { hp: resultHp > 0 ? resultHp : 0, isAlive }});
        }

        return applyHit({ id: '', changes: {}});
      }),
    ));
  }

  private applyHitFn$(): CreateEffectMetadata {
    return createEffect(() => this.actions$.pipe(
      ofType(applyHit),
      withLatestFrom(this.store.select(selectTurn)),
      map(([ action, turn ]) => moveCompleted({ id: turn.movingFighter })),
    ));
  }
}
