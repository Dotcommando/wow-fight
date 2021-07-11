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

export const phaseMoving = createAction(
  `[ TURN ] Moving`,
);

export const phaseAfterMove = createAction(
  `[ TURN ] After Move`,
);

export const turnActiveFighterChanging = createAction(
  `[ TURN ] Change active fighter`,
  props<{ activeFighterId: string; activePartyId: string }>(),
);

export const nextTurn = createAction(
  `[ TURN ] Next turn`,
);

export const turnChangeNextFighter = createAction(
  `[ TURN ] Change active fighter`,
  props<{ nextFighter: string; nextPartyId: string }>(),
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
  props<{ turn: ITurnState }>(),
);

export const deleteBattle = createAction(
  `[ BATTLE ] Delete Battle`,
);
