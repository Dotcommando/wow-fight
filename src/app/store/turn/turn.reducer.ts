import { createEntityAdapter, EntityAdapter, EntityState } from '@ngrx/entity';
import { Action, createReducer, on } from '@ngrx/store';

import { PHASE } from '../../constants/phase.constant';
import { ITurn } from '../../models/turn.interface';
import { deleteBattle, turnActiveFighterChanging, turnPhaseChanging, turnStarted, turnUpdated } from './turn.actions';


export const turnFeatureKey = 'turn';

export interface ITurnState extends EntityState<ITurn> {
}

const adapter: EntityAdapter<ITurn> = createEntityAdapter<ITurn>({
  selectId: turn => turn.roundNumber,
});

const initialState: ITurnState = adapter.getInitialState({});

const turnActivitiesReducerFn = createReducer(
  initialState,
  on(turnStarted,
    (state, { turn }: { turn: ITurn }) => adapter.addOne(turn, state),
  ),
  on(turnPhaseChanging,
    (state, { phase }: { phase: PHASE }) => {
      // @ts-ignore
      const maxIndex = Math.max(...state.ids.map((id: number) => Number(id)));

      return adapter.updateOne({ id: maxIndex, changes: { phase }}, state);
    },
  ),
  on(turnActiveFighterChanging,
    (state, { activeFighterId }: { activeFighterId: string }) => {
      // @ts-ignore
      const maxIndex = Math.max(...state.ids.map((id: number) => Number(id)));

      return adapter.updateOne({ id: maxIndex, changes: { movingFighter: activeFighterId, phase: PHASE.BEFORE_MOVE }}, state);
    },
  ),
  on(turnUpdated,
    (state, { turn }: { turn: ITurn }) => adapter.updateOne({ id: turn.roundNumber, changes: turn }, state),
  ),
  on(deleteBattle,
    (state) => adapter.removeAll(state),
  ),
);

export function reducer(state: ITurnState, action: Action): ITurnState {
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
