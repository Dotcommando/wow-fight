import { createAction, props } from '@ngrx/store';

import { ICastedSpell } from '../../models/casted-spell.interface';

export const addSpell = createAction(
  `[ SPELLS ] Add Spell`,
  props< { spell: ICastedSpell }>(),
);

export const updateSpell = createAction(
  `[ SPELLS ] Update Spell`,
  props< { id: string; changes: Partial<ICastedSpell> }>(),
);

export const removeSpell = createAction(
  `[ SPELLS ] Remove Spell`,
  props< { id: string }>(),
);
