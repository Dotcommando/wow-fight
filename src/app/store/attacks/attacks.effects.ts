import { Injectable } from '@angular/core';

import { Actions, createEffect, CreateEffectMetadata, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';

import { map, withLatestFrom } from 'rxjs/operators';

import { PHASE } from '../../constants/phase.constant';
import { IAttackState, ICharacterShort } from '../../models/attack-vectors.interface';
import { IBeastCharacter, IMainCharacter, InstanceOf } from '../../models/character.type';
import { selectAttackVectors } from '../attackVectors/attack-vectors.selectors';
import { selectCharacters } from '../fighters/fighters.selectors';
import { addSpell, executeSpellsAfterMove, executeSpellsBeforeMove } from '../spells/spells.actions';
import { phaseAfterMove, phaseMoving } from '../turn/turn.actions';
import { selectTurn } from '../turn/turn.selectors';
import { clearSpellInAttack, updateAttack, updatePlayerAttack } from './attacks.actions';


@Injectable()
export class AttacksEffects {
  public spellsExecution$ = this.spellsExecutionFn$();
  public addSpell$ = this.addSpellFn$();
  public clearSpellInAttack$ = this.clearSpellInAttackFn$();
  public phaseMoving$ = this.phaseMovingFn$();
  public updateAttack$ = this.updateAttackFn$();

  constructor(
    private actions$: Actions,
    private store: Store,
  ) {}

  private spellsExecutionFn$(): CreateEffectMetadata {
    return createEffect(() => this.actions$.pipe(
      ofType(updatePlayerAttack),
      map(() => phaseAfterMove()),
    ));
  }

  private addSpellFn$(): CreateEffectMetadata {
    return createEffect(() => this.actions$.pipe(
      ofType(addSpell),
      map(() => clearSpellInAttack()),
    ));
  }

  private clearSpellInAttackFn$(): CreateEffectMetadata {
    return createEffect(() => this.actions$.pipe(
      ofType(clearSpellInAttack),
      withLatestFrom(this.store.select(selectTurn)),
      map(([ action, { phase } ]) => phase === PHASE.BEFORE_MOVE
        ? executeSpellsBeforeMove()
        : executeSpellsAfterMove(),
      ),
    ));
  }

  private phaseMovingFn$(): CreateEffectMetadata {
    return createEffect(() => this.actions$.pipe(
      ofType(phaseMoving),
      withLatestFrom(
        this.store.select(selectAttackVectors),
        this.store.select(selectTurn),
        this.store.select(selectCharacters),
      ),
      map(([ action, attackVectors, { movingFighter }, fighters ]) => {
        const assaulter: InstanceOf<IMainCharacter | IBeastCharacter> = fighters.find(fighter => fighter.id === movingFighter);
        const assaulterShort: ICharacterShort = { name: assaulter.name, id: assaulter.id };
        const attacks: IAttackState[] = [];

        if (attackVectors.skip) {
          attacks.push({ assaulter: assaulterShort, skip: true, hit: false, spell: null, target: null });
        }

        if (attackVectors.hit.length) {
          for (const hitAttackOption of attackVectors.hit) {
            attacks.push({ assaulter: assaulterShort, skip: false, spell: null, target: hitAttackOption.target, hit: true });
          }
        }

        if (attackVectors.cast.length) {
          for (const castAttackOption of attackVectors.cast) {
            attacks.push({ assaulter: assaulterShort, skip: false, spell: castAttackOption.spell, target: castAttackOption.target, hit: false });
          }
        }

        const randomAttack = Math.round((Math.random() * 100)) % attacks.length;

        console.log(attacks);
        console.log(attacks[randomAttack]);
        return updateAttack({ attack: attacks[randomAttack] });
      }),
    ));
  }

  private updateAttackFn$(): CreateEffectMetadata {
    return createEffect(() => this.actions$.pipe(
      ofType(updateAttack),
      map(() => phaseAfterMove()),
    ));
  }
}
