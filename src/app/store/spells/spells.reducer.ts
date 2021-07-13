import { createEntityAdapter, EntityAdapter, EntityState } from '@ngrx/entity';
import { Action, createReducer, on } from '@ngrx/store';

import { UUID } from 'angular2-uuid';

import { ALL_SPELLS } from '../../constants/spells.constant';
import { SPELLS } from '../../constants/spells.enum';
import { ISpellShort } from '../../models/attack-vectors.interface';
import { ICastedSpell } from '../../models/casted-spell.interface';
import { addSpell, reduceSpellExpiration, removeSpell, resetFiredStatus, updateSpell } from './spells.actions';


export const spellsFeatureKey = 'spells';

export interface ISpellsState extends EntityState<ICastedSpell> {}

const adapter: EntityAdapter<ICastedSpell> = createEntityAdapter({
  selectId: spell => spell.id,
});

const initialState: ISpellsState = adapter.getInitialState({});

const spellsReducerFn = createReducer(
  initialState,
  on(addSpell,
    (state, { attack }) => {
      if (!attack.spell) return state;

      const newSpell = attack.spell as ISpellShort;
      const spellProto = ALL_SPELLS.find(spell => newSpell.name === spell.name);

      if (!spellProto || !attack.assaulter?.id) return state;

      return adapter.addOne({
        id: UUID.UUID(),
        spellName: newSpell.name as SPELLS,
        expiredIn: spellProto.duration,
        target: attack.target?.id ?? null,
        assaulter: attack.assaulter.id,
        fireOnStage: spellProto.fireOnStage,
        stageOf: spellProto.stageOf,
        firedInThisTurn: false,
      }, state);
    },
  ),
  on(reduceSpellExpiration,
    (state, { spellId }: { spellId: string }) => {
      const spell = state.entities[spellId];

      if (!spell) throw new Error(`Cannot find spell by id ${spellId}.`);

      if (spell.expiredIn === 0) {
        return adapter.removeOne(spellId, state);
      }

      return adapter.updateOne({ id: spellId, changes: { expiredIn: spell.expiredIn - 1, firedInThisTurn: true }}, state);
    },
  ),
  on(updateSpell,
    (state, update) => adapter.updateOne(update, state),
  ),
  on(removeSpell,
    (state, { id }) => adapter.removeOne(id, state),
  ),
  on(resetFiredStatus,
    // @ts-ignore
    (state) => adapter.updateMany(state.ids.map(id => state.entities[id]).map(spell => ({ id: spell.id, changes: { fired: false }})), state),
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
