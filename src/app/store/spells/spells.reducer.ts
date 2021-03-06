import { createEntityAdapter, EntityAdapter, EntityState } from '@ngrx/entity';
import { Action, createReducer, on } from '@ngrx/store';

import { UUID } from 'angular2-uuid';

import { ALL_SPELLS } from '../../constants/spells.constant';
import { SPELLS } from '../../constants/spells.enum';
import { ISpellShort } from '../../models/attack-vectors.interface';
import { ICastedSpell } from '../../models/casted-spell.interface';
import {
  addSpell,
  clearSpells,
  reduceSpellCooldown,
  reduceSpellExpiration,
  resetFiredStatus,
} from './spells.actions';


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

      const id = UUID.UUID();

      return adapter.addOne({
        id,
        spellName: newSpell.name as SPELLS,
        expiredIn: spellProto.duration,
        coolDown: spellProto.coolDown,
        target: attack.target?.id ?? attack.assaulter.id,
        assaulter: attack.assaulter.id,
        fireOnStage: spellProto.fireOnStage,
        stageOf: spellProto.stageOf,
        firedInThisTurn: false,
        coolDownReduced: false,
      }, state);
    },
  ),
  on(reduceSpellExpiration,
    (state, { spellId }: { spellId: string }) => {
      const spell = state.entities[spellId];

      if (!spell) throw new Error(`Cannot find spell by id ${spellId} in reduceSpellExpiration.`);

      if (spell.expiredIn <= -1 && spell.coolDown <= 0) {
        return adapter.removeOne(spellId, state);
      }

      return adapter.updateOne({
        id: spellId,
        changes: {
          expiredIn: spell.expiredIn - 1 < -1 ? -1 : spell.expiredIn - 1,
          firedInThisTurn: true,
        },
      }, state);
    },
  ),
  on(reduceSpellCooldown,
    (state, { spellId }: { spellId: string }) => {
      const spell = state.entities[spellId];

      if (!spell) throw new Error(`Cannot find spell by id ${spellId} in 'reduceSpellCooldown'.`);

      if (spell.expiredIn <= 0 && spell.coolDown <= 0) {
        return adapter.removeOne(spellId, state);
      }

      return adapter.updateOne({
        id: spellId,
        changes: {
          coolDown: spell.coolDown - 1 < 0 ? 0 : spell.coolDown - 1,
          coolDownReduced: true,
        },
      }, state);
    },
  ),
  on(resetFiredStatus,
    (state) => adapter
      .updateMany(state.ids
        // @ts-ignore
        .map(id => state.entities[id])
        .map(spell => ({ id: spell.id, changes: { firedInThisTurn: false, coolDownReduced: false }})),
      state),
  ),
  on(clearSpells,
    (state) => adapter.removeAll(state),
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
