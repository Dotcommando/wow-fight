import { createEntityAdapter, EntityAdapter, EntityState } from '@ngrx/entity';
import { Action, createReducer, on } from '@ngrx/store';

import { ICastedSpell } from '../../models/casted-spell.interface';
import { addSpell, removeSpell, updateSpell } from './spells.actions';


export const spellsFeatureKey = 'spells';

export interface ISpellsState extends EntityState<ICastedSpell> {}

const adapter: EntityAdapter<ICastedSpell> = createEntityAdapter({
  selectId: spell => spell.id,
});

const initialState: ISpellsState = adapter.getInitialState({});

const spellsReducerFn = createReducer(
  initialState,
  on(addSpell,
    (state, { spell }) => adapter.upsertOne(spell, state),
  ),
  on(updateSpell,
    (state, update) => adapter.updateOne(update, state),
  ),
  on(removeSpell,
    (state, { id }) => adapter.removeOne(id, state),
  ),
);

export function reducer(state: ISpellsState, action: Action): ISpellsState {
  return spellsReducerFn(state, action);
}

const {
  selectIds,
  selectEntities,
  selectAll,
  selectTotal,
} = adapter.getSelectors();

export const selectAllSpells = selectAll;
export const selectSpellsEntities = selectEntities;
