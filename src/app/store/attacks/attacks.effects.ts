import { Injectable } from '@angular/core';

import { Actions, createEffect, CreateEffectMetadata, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';

import { map, withLatestFrom } from 'rxjs/operators';

import { PHASE } from '../../constants/phase.constant';
import { addSpell, executeSpellsAfterMove, executeSpellsBeforeMove } from '../spells/spells.actions';
import { phaseAfterMove } from '../turn/turn.actions';
import { selectTurn } from '../turn/turn.selectors';
import { clearSpellInAttack, updateAttack } from './attacks.actions';


@Injectable()
export class AttacksEffects {
  public spellsExecution$ = this.spellsExecutionFn$();
  public addSpell$ = this.addSpellFn$();
  public clearSpellInAttack$ = this.clearSpellInAttackFn$();

  constructor(
    private actions$: Actions,
    private store: Store,
  ) {}

  private spellsExecutionFn$(): CreateEffectMetadata {
    return createEffect(() => this.actions$.pipe(
      ofType(updateAttack),
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
}
