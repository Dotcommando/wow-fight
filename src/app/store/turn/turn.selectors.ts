import { createFeatureSelector, createSelector } from '@ngrx/store';

import { PHASE } from '../../constants/phase.constant';
import { ITurnState } from '../../models/turn.interface';
import { turnFeatureKey } from './turn.reducer';

export const selectTurn = createFeatureSelector<ITurnState>(turnFeatureKey);

export const selectCurrentPhase = createSelector(
  selectTurn,
  (state: ITurnState): PHASE | null => state.phase,
);

export const selectRoundNumber = createSelector(
  selectTurn,
  (state: ITurnState): number => state.roundNumber,
);

export const selectCurrentFighterId = createSelector(
  selectTurn,
  (state: ITurnState): string => state.movingFighter,
);
