import { Injectable } from '@angular/core';

import { Actions, createEffect, CreateEffectMetadata, ofType } from '@ngrx/effects';

import { map } from 'rxjs/operators';

import { addSpell, executeSpells } from '../spells/spells.actions';
import { phaseAfterMove } from '../turn/turn.actions';
import { clearSpellInAttack, updateAttack } from './attacks.actions';


@Injectable()
export class AttacksEffects {
  public spellsExecution$ = this.spellsExecutionFn$();
  public addSpell$ = this.addSpellFn$();
  public clearSpellInAttack$ = this.clearSpellInAttackFn$();

  constructor(
    private actions$: Actions,
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
      map(() => executeSpells()),
    ));
  }
}
