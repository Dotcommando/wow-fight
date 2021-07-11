import { Injectable } from '@angular/core';

import { Actions, createEffect, CreateEffectMetadata, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';

import { tap, withLatestFrom } from 'rxjs/operators';

import { BattleService } from '../../services/battle.service';
import { selectAttack } from '../attacks/attacks.selectors';
import { selectCharacters, selectParties } from '../fighters/fighters.selectors';
import { selectTurn } from '../turn/turn.selectors';
import { executeSpells } from './spells.actions';
import { selectSpells } from './spells.selectors';

@Injectable()
export class SpellsEffects {
  public executeSpells$ = this.executeSpellsFn();

  constructor(
    private actions$: Actions,
    private store: Store,
    private battleService: BattleService,
  ) {}

  private executeSpellsFn() : CreateEffectMetadata {
    return createEffect(() => this.actions$.pipe(
      ofType(executeSpells),
      withLatestFrom(
        this.store.select(selectCharacters),
        this.store.select(selectParties),
        this.store.select(selectSpells),
        this.store.select(selectTurn),
        this.store.select(selectAttack),
      ),
      tap(([ action, characters, parties, spells, currentTurn, attack ]) => this.battleService
        .pushSpellsLoop({ characters, parties, spells, currentTurn, attack })),
    ), { dispatch: false });
  }
}
