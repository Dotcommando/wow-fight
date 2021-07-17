import { Action, createReducer, on } from '@ngrx/store';

import { IAttackVectors } from '../../models/attack-vectors.interface';
import { resetAttackVectors, setAttackVectors } from './attack-vectors.actions';

export const attackVectorsFeatureKey = 'attackVectors';

const initialState: IAttackVectors = {
  hit: [],
  cast: [],
  skip: true,
};

const attackVectorsReducerFn = createReducer(
  initialState,
  on(setAttackVectors,
    (state, { vectors }) => ({ ...state, ...vectors }),
  ),
  on(resetAttackVectors,
    () => ({ hit: [], cast: [], skip: true }),
  ),
);

export function reducer(state: IAttackVectors, action: Action): IAttackVectors {
  return attackVectorsReducerFn(state, action);
}
