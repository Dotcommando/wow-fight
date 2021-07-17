import { Injectable } from '@angular/core';

import { Actions, createEffect, CreateEffectMetadata, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';

import { map, withLatestFrom } from 'rxjs/operators';

import { PHASE } from '../../constants/phase.constant';
import { BattleService } from '../../services/battle.service';
import { selectAttack } from '../attacks/attacks.selectors';
import { applyHit, moveCompleted, restoreFighterAfterSpell } from '../fighters/fighters.actions';
import { selectCharacters } from '../fighters/fighters.selectors';
import { selectTurn } from '../turn/turn.selectors';
import {
  executeHit,
  executeSpellsAfterMove,
  executeSpellsBeforeMove, reduceSpellCooldown,
  reduceSpellExpiration,
} from './spells.actions';
import { selectSpells } from './spells.selectors';

@Injectable()
export class SpellsEffects {
  public reduceSpellExpiration$ = this.reduceSpellExpirationFn$();
  public reduceSpellCooldown$ = this.reduceSpellCooldownFn$();
  public executeHit$ = this.executeHitFn$();
  public applyHit$ = this.applyHitFn$();
  public restoreFighterAfterSpell$ = this.restoreFighterAfterSpellFn$();

  constructor(
    private actions$: Actions,
    private store: Store,
    private battleService: BattleService,
  ) {}

  private reduceSpellExpirationFn$(): CreateEffectMetadata {
    return createEffect(() => this.actions$.pipe(
      ofType(reduceSpellExpiration),
      withLatestFrom(this.store.select(selectSpells)),
      map(([ { spellId }, spells ]) => restoreFighterAfterSpell({ spell: spells.find(spell => spell.id === spellId) })),
    ));
  }

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
