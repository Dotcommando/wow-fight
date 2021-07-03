import { createFeatureSelector, createSelector } from '@ngrx/store';

import { ITurn } from '../../models/turn.interface';
import { ITurnState, selectAllTurns, turnFeatureKey } from './turn.reducer';

export const selectedTurns = createFeatureSelector<ITurnState>(turnFeatureKey);

export const selectTurns = createSelector(
  selectedTurns,
  selectAllTurns,
);

export const selectCurrentTurn = createSelector(
  selectedTurns,
  (state: ITurnState) => {
    const maxRoundTurn = state.entities[1];

    if (state.ids.length === 1) {
      return maxRoundTurn;
    } else {
      const turns = state.entities;

      return state.ids
        // @ts-ignore
        .reduce((maxIndex: number, index: number) => {
          // @ts-ignore
          if (!turns[index] || typeof turns[index].roundNumber !== 'number') {
            return turns[maxIndex];
          }

          // @ts-ignore
          return turns[maxIndex].roundNumber > turns[index].roundNumber
            ? turns[maxIndex]
            : turns[index];
        },
        maxRoundTurn,
        );
    }
  },
);
