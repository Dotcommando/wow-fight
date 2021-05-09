import { createEntityAdapter, EntityAdapter, EntityState } from '@ngrx/entity';
import { Action, createReducer, on } from '@ngrx/store';

import { ITurn } from '../../models/turn.interface';
import { deleteBattle, turnStarted, turnUpdated } from './battle.actions';


export const battleFeatureKey = 'battle';

export interface ITurnActivitiesState extends EntityState<ITurn> {
}

const adapter: EntityAdapter<ITurn> = createEntityAdapter<ITurn>({
  selectId: turn => turn.roundNumber,
});

const initialState: ITurnActivitiesState = adapter.getInitialState({
});

const turnActivitiesReducerFn = createReducer(
  initialState,
  on(turnStarted,
    (state, { turn }: { turn: ITurn }) => adapter.addOne(turn, state),
  ),
  on(turnUpdated,
    (state, { turn }: { turn: ITurn }) => adapter.setOne(turn, state),
  ),
  on(deleteBattle,
    (state) => adapter.removeAll(state),
  ),
);

export function reducer(state: ITurnActivitiesState, action: Action): ITurnActivitiesState {
  return turnActivitiesReducerFn(state, action);
}

const {
  selectIds,
  selectEntities,
  selectAll,
  selectTotal,
} = adapter.getSelectors();

export const selectAllTurns = selectAll;
export const selectAllTurnsNumber = selectTotal;
