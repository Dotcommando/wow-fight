import { createEntityAdapter, EntityAdapter, EntityState } from '@ngrx/entity';
import { Action, createReducer, on } from '@ngrx/store';

import { UUID } from 'angular2-uuid';

import { MOVE_STATUSES } from '../../constants/move-statuses.enum';
import { NAMES } from '../../constants/name.enum';
import { ALL_SPELLS } from '../../constants/spells.constant';
import { SPELLS } from '../../constants/spells.enum';
import { STATUSES } from '../../constants/statuses.enum';
import { createBeast, createCharacter } from '../../helpers/create-character.helper';
import { IBeastCharacter, IMainCharacter, InstanceOf } from '../../models/character.type';
import {
  applyHit,
  applySpellToCharacter,
  clearDeadBeasts,
  moveCompleted,
  recreateCharacters,
  resetMoveStatus,
  restoreFighterAfterSpell,
  toggleCharacters,
  updateCharacters,
} from './fighters.actions';


const playerPartyId = UUID.UUID();
const cpuPartyId = UUID.UUID();

export const fightersFeatureKey = 'fighters';

const randomNumber = Math.random();
const playerCharacterName = randomNumber < 0.5 ? NAMES.NERZHUL : NAMES.GULDAN;
const cpuCharacterName = randomNumber >= 0.5 ? NAMES.NERZHUL : NAMES.GULDAN;
const startPlayerCharacter = createCharacter({
  name: playerCharacterName,
  party: playerPartyId,
  status: STATUSES.PLAYER,
  id: UUID.UUID(),
  canNotAttack: false,
  canNotCast: false,
  priority: 10,
});
const startCPUCharacter = createCharacter({
  name: cpuCharacterName,
  party: cpuPartyId,
  status: STATUSES.CPU,
  id: UUID.UUID(),
  canNotAttack: false,
  canNotCast: false,
  priority: 20,
});

export interface IFightersState extends EntityState<InstanceOf<IMainCharacter | IBeastCharacter>> {
  playerPartyId: string;
  cpuPartyId: string;
}

const adapter: EntityAdapter<InstanceOf<IMainCharacter | IBeastCharacter>> = createEntityAdapter({
  selectId: character => character.id,
});

const startState: IFightersState = adapter.getInitialState({
  playerPartyId,
  cpuPartyId,
});

const initialState: IFightersState = {
  ...startState,
  ids: [
    ...startState.ids,
    startPlayerCharacter.id,
    startCPUCharacter.id,
  ] as string[],
  entities: {
    ...startState.entities,
    [startPlayerCharacter.id]: startPlayerCharacter,
    [startCPUCharacter.id]: startCPUCharacter,
  },
};

const fightersReducerFn = createReducer(
  initialState,
  on(updateCharacters,
    (state, { changes }) => adapter
      .updateMany(changes, state),
  ),
  on(toggleCharacters,
    (state: IFightersState) => {
      let player;
      let cpu;
      const charactersArray = { ...state.entities };

      for (const id in charactersArray) {
        if (charactersArray[id]?.status === STATUSES.PLAYER) {
          player = { ...charactersArray[ id ] };
          break;
        }
      }

      if (!player) {
        throw new Error('Player instance is not found in store.');
      }

      for (const id in charactersArray) {
        if (charactersArray[id]?.status === STATUSES.CPU) {
          cpu = { ...charactersArray[ id ] };
          break;
        }
      }

      if (!cpu) {
        throw new Error('CPU instance is not found in store.');
      }

      if (!player.id) {
        throw new Error('Players\'s id is undefined.');
      }

      if (!cpu.id) {
        throw new Error('CPU\'s id is undefined.');
      }

      return adapter.updateMany([
        {
          id: player.id,
          changes: { ...cpu, status: player.status, id: player.id, partyId: player.partyId, priority: 10 },
        },
        {
          id: cpu.id,
          changes: { ...player, status: cpu.status, id: cpu.id, partyId: cpu.partyId, priority: 20 },
        },
      ], state);
    },
  ),
  on(applySpellToCharacter,
    (state: IFightersState, { damage }) => {
      if (!damage.isSpell || (damage.isSpell && damage.isSkip)) {
        return state;
      }

      switch (damage.spellName) {
        case SPELLS.REBIRTH:
          return adapter.addOne(
            createBeast(
              damage.beastParams.beastName,
              damage.beastParams.partyId,
              damage.beastParams.priority,
              damage.beastParams.status,
            ),
            state);

        default:
          break;
      }

      return adapter.updateOne({ id: damage.target, changes: damage.targetChanges }, state);
    },
  ),
  on(applyHit,
    (state, { id, changes }) => adapter.updateOne({ id, changes }, state),
  ),
  on(moveCompleted,
    (state, { id }) => adapter.updateOne({ id, changes: { move: MOVE_STATUSES.MOVED }}, state),
  ),
  on(resetMoveStatus,
    (state) => adapter.updateMany(
      (state.ids as string[])
        .map(id => state.entities[id])
        .map(fighter => ({ id: fighter.id, changes: { move: MOVE_STATUSES.NOT_MOVED }})),
      state,
    ),
  ),
  on(clearDeadBeasts,
    (state) => {
      const deadBeasts = (state.ids as string[])
        .map(id => state.entities[id])
        .filter(fighter => !fighter.isAlive);

      if (!deadBeasts.length) return state;

      return adapter.removeMany(
        deadBeasts.map(beast => beast.id),
        state,
      );
    },
  ),
  on(restoreFighterAfterSpell,
    (state, { spell }) => {
      if (spell?.expiredIn <= -1) {
        const spellboundFighter = state.entities[spell.target];

        if (!spellboundFighter) {
          return state;
        }

        const spellProto = ALL_SPELLS.find(spellPrototype => spellPrototype.name === spell.spellName);

        if (!spellProto) {
          throw new Error(`Cannot find spell with name ${spell.spellName} in 'restoreFighterAfterSpell'.`);
        }

        if (spellProto.canNotCast && spellProto.canNotAttack) {
          return adapter.updateOne({
            id: spellboundFighter.id,
            changes: { canNotAttack: false, canNotCast: false },
          }, state);
        } else if (spellProto.canNotAttack) {
          return adapter.updateOne({
            id: spellboundFighter.id,
            changes: { canNotAttack: false },
          }, state);
        } else if (spellProto.canNotCast) {
          return adapter.updateOne({
            id: spellboundFighter.id,
            changes: { canNotCast: false },
          }, state);
        }
      }

      return state;
    },
  ),
  on(recreateCharacters,
    () => ({ ...initialState }),
  ),
);

export function reducer(state: IFightersState, action: Action): IFightersState {
  return fightersReducerFn(state, action);
}

const {
  selectIds,
  selectEntities,
  selectAll,
  selectTotal,
} = adapter.getSelectors();

export const selectAllCharacters = selectAll;
export const selectCharactersEntities = selectEntities;
