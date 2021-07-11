import { Injectable } from '@angular/core';

import { Actions, createEffect, CreateEffectMetadata, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { TypedAction } from '@ngrx/store/src/models';

import { map, mergeMap, switchMap, tap, withLatestFrom } from 'rxjs/operators';

import { PHASE } from '../../constants/phase.constant';
import { IHitAttack } from '../../models/attack-vectors.interface';
import { IBeastCharacter, IMainCharacter, InstanceOf } from '../../models/character.type';
import { CombinedFightersParties } from '../../models/combined-fighter-parties.type';
import { BattleService } from '../../services/battle.service';
import { addSpell } from '../spells/spells.actions';
import { phaseBeforeMove, phaseMoving } from '../turn/turn.actions';
import { fighterHasCompletedMove, fighterHasStartedMove, nextFighter, updateCharacter } from './fighters.actions';
import { selectCharacters, selectParties } from './fighters.selectors';

@Injectable()
export class FightersEffects {
  // public nextFighter$ = this.nextFighterFn$();
  public moveStarted$ = this.moveStartedFn$();
  public beforeMove$ = this.beforeMoveFn$();
  // public moveCompleted$ = this.moveCompletedFn$();

  constructor(
    private actions$: Actions,
    private store: Store,
    private battleService: BattleService,
  ) {}

  private moveStartedFn$(): CreateEffectMetadata {
    return createEffect(() => this.actions$.pipe(
      ofType(fighterHasStartedMove),
      map(() => phaseBeforeMove()),
    ));
  }

  private beforeMoveFn$(): CreateEffectMetadata {
    return createEffect(() => this.actions$.pipe(
      ofType(phaseBeforeMove),
      map(() => phaseMoving()),
    ));
  }

  // private moveCompletedFn$(): CreateEffectMetadata {
  //   return createEffect(() => this.actions$.pipe(
  //     ofType(moveCompleted),
  //     withLatestFrom(this.store.select(selectCharacters), this.store.select(selectParties)),
  //     switchMap(([ action, fighters, parties ]) => {
  //       const { assaulter, attack } = action;
  //
  //       let nextAction: () => TypedAction<`[ TURN ] Phase changing`> & { phase: PHASE }
  //                           | TypedAction<`[ FIGHTERS ] Update One`> & { character: InstanceOf<IMainCharacter | IBeastCharacter> }
  //         = () => turnPhaseChanging({ phase: PHASE.AFTER_MOVE });
  //
  //       if (!attack) {
  //         return [ action, fighters, parties ];
  //       } else if (attack.hit) {
  //         if (!(attack as IHitAttack)?.hit) {
  //           return [ fighters, parties ];
  //         }
  //
  //         const damage = Math.random() > assaulter.crit
  //           ? assaulter.dps * 1.5
  //           : assaulter.dps;
  //
  //         const defender = fighters.find(fighter => fighter.id === attack?.target?.id);
  //
  //         if (defender) {
  //           nextAction = () => updateCharacter({
  //             character: { ...defender, hp: defender.hp - damage },
  //           });
  //         }
  //       } else if (attack.spell) {
  //
  //       }
  //
  //       return [ action, fighters, parties ];
  //     }),
  //     map(() => turnPhaseChanging({ phase: PHASE.AFTER_MOVE })),
  //   ));
  // }

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
