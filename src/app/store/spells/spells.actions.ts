import { createAction, props } from '@ngrx/store';

import { IAttackState } from '../../models/attack-vectors.interface';

export const addSpell = createAction(
  `[ SPELLS ] Add Spell`,
  props< { attack: Partial<IAttackState> }>(),
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

export const reduceSpellCooldown = createAction(
  `[ SPELLS ] Reduce Spell Cooldown`,
  props<{ spellId: string }>(),
);
