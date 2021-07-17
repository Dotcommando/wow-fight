import { createAction, props } from '@ngrx/store';

import { IAttackVectors } from '../../models/attack-vectors.interface';

export const setAttackVectors = createAction(
  '[ VECTORS ] Set Attack Vectors',
  props<{ vectors: IAttackVectors }>(),
);

export const resetAttackVectors = createAction(
  '[ VECTORS ] Reset Attack Vectors',
);
