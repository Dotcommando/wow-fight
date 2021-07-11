import { Action, createReducer, on } from '@ngrx/store';

import { PHASE } from '../../constants/phase.constant';
import { ITurnState } from '../../models/turn.interface';
import {
  phaseAfterMove,
  phaseBeforeMove,
  phaseMoving,
  turnChangeNextFighter,
  turnStarted,
} from './turn.actions';


export const turnFeatureKey = 'turn';

const initialState: ITurnState = {
  roundNumber: 0,
  activeParty: '',
  movingFighter: '',
  phase: null,
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
    (state, { nextFighter, nextPartyId }) => ({ ...state, movingFighter: nextFighter, activeParty: nextPartyId }),
  ),
);

export function reducer(state: ITurnState, action: Action): ITurnState {
  return turnActivitiesReducerFn(state, action);
}
