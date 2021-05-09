import { createAction, props } from '@ngrx/store';

import { ITurn } from '../../models/turn.interface';

export const turnCompleted = createAction(
  `[ BATTLE ] Turn Completed`,
  props<{ turn: ITurn }>(),
);

export const deleteBattle = createAction(
  `[ BATTLE ] Delete Battle`,
);
