import { Injectable } from '@angular/core';

import { Actions, createEffect, CreateEffectMetadata, ofType } from '@ngrx/effects';

import { map } from 'rxjs/operators';

import { executeSpells } from '../spells/spells.actions';
import { updateAttack } from './attacks.actions';


@Injectable()
export class AttacksEffects {
  public spellsExecution$ = this.spellsExecutionFn$();

  constructor(
    private actions$: Actions,
  ) {}

  private spellsExecutionFn$(): CreateEffectMetadata {
    return createEffect(() => this.actions$.pipe(
      ofType(updateAttack),
      map(() => executeSpells()),
    ));
  }
}
