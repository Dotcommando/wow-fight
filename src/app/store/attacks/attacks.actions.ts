import { createAction, props } from '@ngrx/store';

import { IAttackState } from '../../models/attack-vectors.interface';

export const updateAttack = createAction(
  `[ ATTACK ] Update Attack`,
  props< { attack: Partial<IAttackState> }>(),
);

export const clearSpellInAttack = createAction(
  `[ ATTACK ] Clear Spell in Attack`,
);
