import { Action, createReducer, on } from '@ngrx/store';

import { PHASE } from '../../constants/phase.constant';
import { ITurnState } from '../../models/turn.interface';
import {
  phaseAfterMove,
  phaseBeforeMove,
  phaseMoving,
  setWinner,
  turnChangeNextFighter,
  turnStarted,
} from './turn.actions';


export const turnFeatureKey = 'turn';

const initialState: ITurnState = {
  roundNumber: 0,
  activeParty: '',
  movingFighter: '',
  phase: null,
  winner: null,
};

const turnActivitiesReducerFn = createReducer(
  initialState,
  on(turnStarted,
    (state) => ({ ...state, roundNumber: state.roundNumber + 1 }),
  ),
  on(
    phaseBeforeMove,
    (state) => ({ ...state, phase: PHASE.BEFORE_MOVE }),
  ),
  on(
    phaseMoving,
    (state) => ({ ...state, phase: PHASE.MOVING }),
  ),
  on(
    phaseAfterMove,
    (state) => ({ ...state, phase: PHASE.AFTER_MOVE }),
  ),
  on(turnChangeNextFighter,
    (state, { nextFighterId, nextPartyId }) => nextPartyId
      ? ({ ...state, movingFighter: nextFighterId, activeParty: nextPartyId })
      : ({ ...state, movingFighter: nextFighterId }),
  ),
  on(setWinner,
    (state, { winner }) => ({ ...state, winner }),
  ),
);

export function reducer(state: ITurnState, action: Action): ITurnState {
  return turnActivitiesReducerFn(state, action);
}
