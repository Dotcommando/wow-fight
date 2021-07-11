import { Action, createReducer, on } from '@ngrx/store';

import { IAttackState } from '../../models/attack-vectors.interface';
import { updateAttack } from './attacks.actions';


export const attackFeatureKey = 'attack';

export const initialState: IAttackState = {
  assaulter: null,
  target: null,
  hit: false,
  spell: null,
  skip: false,
};

const attackReducerFn = createReducer(
  initialState,
  on(updateAttack,
    (state, { attack }) => ({ ...initialState, ...attack }),
  ),
);

export function reducer(state: IAttackState, action: Action): IAttackState {
  return attackReducerFn(state, action);
}
