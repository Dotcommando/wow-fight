import { createAction, props } from '@ngrx/store';

import { ITurnState } from '../../models/turn.interface';

export const gameStarted = createAction(
  `[ START ] Game Started`,
  props<{ playerId: string; playerPartyId: string }>(),
);

export const turnStarted = createAction(
  `[ TURN ] Started`,
  props<{ turn: ITurnState }>(),
);

export const phaseBeforeMove = createAction(
  `[ TURN ] Before Move`,
);

export const calculateAttackVector = createAction(
  `[ TURN ] Calculation of Attack Vectors`,
);

export const phaseMoving = createAction(
  `[ TURN ] Moving`,
);

export const phasePlayerMoving = createAction(
  `[ TURN ] Player is Moving`,
);

export const phaseAfterMove = createAction(
  `[ TURN ] After Move`,
);

export const turnChangeNextFighter = createAction(
  `[ TURN ] Change active fighter`,
  props<{ nextFighterId: string; nextPartyId: string }>(),
);

export const turnCompleted = createAction(
  `[ TURN ] Completed`,
);

export const gameEnded = createAction(
  `[ END ] Game Ended`,
);

export const turnUpdated = createAction(
  `[ BATTLE ] Turn Updated`,
  props<{ turn: ITurnState }>(),
);

export const setWinner = createAction(
  `[ BATTLE ] Winner`,
  props<{ winner: string | null }>(),
);

export const resetTurns = createAction(
  `[ BATTLE ] Reset Turns`,
);
