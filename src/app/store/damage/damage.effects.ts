import { Injectable } from '@angular/core';

import { Actions, createEffect, CreateEffectMetadata, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';

import { map, withLatestFrom } from 'rxjs/operators';

import { defaultHit } from '../../constants/default-hit';
import { selectAttack } from '../attacks/attacks.selectors';
import { selectCharacters } from '../fighters/fighters.selectors';
import { executeHit } from '../spells/spells.actions';
import { setHitDamage } from './damage.actions';

@Injectable()
export class DamageEffects {
  public executeHit$ = this.executeHitFn$();

  constructor(
    private actions$: Actions,
    private store: Store,
  ) {
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
          const target = fighters.find(fighter => fighter.id === attack.target.id);
          const assaulter = fighters.find(fighter => fighter.id === attack.assaulter.id);
          const critFired = Math.random() <= assaulter.crit;
          const damage = assaulter.dps * (critFired ? 1.5 : 1);
          const resultHp = target.hp - damage;
          const isAlive = resultHp > 0;

          return setHitDamage({
            damage: {
              targetChanges: { id: target.id, changes: { hp: resultHp > 0 ? resultHp : 0, isAlive }},
              date: new Date().getTime(),
              assaulter: assaulter.id,
              target: target.id,
              isSpell: false,
              isHit: true,
              isSkip: false,
              critFired: Math.random() <= assaulter.crit,
              damage,
              callBeast: false,
              spellName: null,
              spellId: null,
              beastParams: null,
            },
          });
        }

        return setHitDamage({
          damage: { ...defaultHit },
        });
      }),
    ));
  }
}
