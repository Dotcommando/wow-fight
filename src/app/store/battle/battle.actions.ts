import { createAction, props } from '@ngrx/store';

import { ITurn } from '../../models/turn.interface';

export const gameStarted = createAction(
  `[ START ] Game Started`,
  // props<{ turn: ITurn }>(),
);

export const turnStarted = createAction(
  `[ TURN ] Started`,
  props<{ turn: ITurn }>(),
);

export const playerMoveStarted = createAction(
  `[ PLAYER ] Move Started`,
  // props<{ turn: ITurn }>(),
);

export const playerMoveCompleted = createAction(
  `[ PLAYER ] Move Completed`,
  // props<{ turn: ITurn }>(),
);

export const playerBeastsMoveStarted = createAction(
  `[ PLAYER'S BEASTS ] Move Started`,
  // props<{ turn: ITurn }>(),
);

export const playerBeastsMoveCompleted = createAction(
  `[ PLAYER'S BEASTS ] Move Completed`,
  // props<{ turn: ITurn }>(),
);

export const cpuMoveStarted = createAction(
  `[ CPU ] Move Started`,
  // props<{ turn: ITurn }>(),
);

export const cpuMoveCompleted = createAction(
  `[ CPU ] Move Completed`,
  // props<{ turn: ITurn }>(),
);

export const cpuBeastsMoveStarted = createAction(
  `[ CPU'S BEASTS ] Move Started`,
  // props<{ turn: ITurn }>(),
);

export const cpuBeastsMoveCompleted = createAction(
  `[ CPU'S BEASTS ] Move Completed`,
  // props<{ turn: ITurn }>(),
);

export const turnCompleted = createAction(
  `[ TURN ] Completed`,
  // props<{ turn: ITurn }>(),
);

export const turnUpdated = createAction(
  `[ BATTLE ] Turn Updated`,
  props<{ turn: ITurn }>(),
);

export const deleteBattle = createAction(
  `[ BATTLE ] Delete Battle`,
);
