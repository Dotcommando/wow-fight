import { createAction, props } from '@ngrx/store';

import { PHASE } from '../../constants/phase.constant';
import { ITurn } from '../../models/turn.interface';

export const gameStarted = createAction(
  `[ START ] Game Started`,
  props<{ playerId: string; playerPartyId: string }>(),
);

export const turnStarted = createAction(
  `[ TURN ] Started`,
  props<{ turn: ITurn }>(),
);

export const turnPhaseChanging = createAction(
  `[ TURN ] Phase changing`,
  props<{ phase: PHASE }>(),
);

export const turnActiveFighterChanging = createAction(
  `[ TURN ] Change active fighter`,
  props<{ activeFighterId: string }>(),
);

export const nextTurn = createAction(
  `[ TURN ] Next turn`,
);

export const turnChangeNextFighter = createAction(
  `[ TURN ] Change active fighter`,
  props<{ nextFighter: string; nextPartyId: string }>(),
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

export const gameEnded = createAction(
  `[ END ] Game Ended`,
  // props<{ turn: ITurn }>(),
);

export const turnUpdated = createAction(
  `[ BATTLE ] Turn Updated`,
  props<{ turn: ITurn }>(),
);

export const deleteBattle = createAction(
  `[ BATTLE ] Delete Battle`,
);
