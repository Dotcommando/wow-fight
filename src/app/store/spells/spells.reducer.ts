import { createEntityAdapter, EntityAdapter, EntityState } from '@ngrx/entity';
import { Action, createReducer, on } from '@ngrx/store';

import { UUID } from 'angular2-uuid';

import { ALL_SPELLS } from '../../constants/spells.constant';
import { SPELLS } from '../../constants/spells.enum';
import { IAttackState, ISpellShort } from '../../models/attack-vectors.interface';
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
