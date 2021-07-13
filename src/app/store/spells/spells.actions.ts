import { createAction, props } from '@ngrx/store';

import { IAttackState } from '../../models/attack-vectors.interface';
import { ICastedSpell } from '../../models/casted-spell.interface';

export const addSpell = createAction(
  `[ SPELLS ] Add Spell`,
  props< { attack: Partial<IAttackState> }>(),
);

export const updateSpell = createAction(
  `[ SPELLS ] Update Spell`,
  props< { id: string; changes: Partial<ICastedSpell> }>(),
);

export const removeSpell = createAction(
  `[ SPELLS ] Remove Spell`,
  props< { id: string }>(),
);

export const executeSpells = createAction(
  `[ SPELLS ] Execute Spells`,
);

export const executeSpellsBeforeMove = createAction(
  `[ SPELLS ] Execute Spells Before Move`,
);

export const executeSpellsAfterMove = createAction(
  `[ SPELLS ] Execute Spells After Move`,
);

export const resetFiredStatus = createAction(
  `[ SPELLS ] Reset Fired Status for All Spells`,
);

export const executeHit = createAction(
  `[ SPELLS ] Execute Hit`,
);

export const reduceSpellExpiration = createAction(
  `[ SPELLS ] Reduce Spell Expiration`,
  props<{ spellId: string }>(),
);
