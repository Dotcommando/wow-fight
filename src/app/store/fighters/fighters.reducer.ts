import { createEntityAdapter, EntityAdapter, EntityState } from '@ngrx/entity';
import { Action, createReducer, on } from '@ngrx/store';

import { UUID } from 'angular2-uuid';

import { NAMES } from '../../constants/name.enum';
import { STATUSES } from '../../constants/statuses.enum';
import { createCharacter } from '../../helpers/create-character.helper';
import { IBeastCharacter, IMainCharacter, InstanceOf } from '../../models/character.type';
import { addCharacter, removeCharacter, toggleCharacters, updateCharacter, updateCharacters } from './fighters.actions';


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
});
const startCPUCharacter = createCharacter({
  name: cpuCharacterName,
  party: cpuPartyId,
  status: STATUSES.CPU,
  id: UUID.UUID(),
  canNotAttack: false,
  canNotCast: false,
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

const partiesReducerFn = createReducer(
  initialState,
  on(addCharacter,
    (state, { character }) => adapter
      // @ts-ignore
      .upsertOne(character, state),
  ),
  on(updateCharacter,
    (state, { character }) => adapter
      .updateOne({ id: character.id, changes: character }, state),
  ),
  on(updateCharacters,
    (state, { characters }) => adapter
      .updateMany(characters.map(character => ({ id: character.id, changes: character })), state),
  ),
  on(removeCharacter,
    (state, { characterId }) => adapter
      .removeOne(characterId, state),
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
          changes: { ...cpu, status: player.status, id: player.id, partyId: player.partyId },
        },
        {
          id: cpu.id,
          changes: { ...player, status: cpu.status, id: cpu.id, partyId: cpu.partyId },
        },
      ], state);
    },
  ),
);

export function reducer(state: IFightersState, action: Action): IFightersState {
  return partiesReducerFn(state, action);
}

const {
  selectIds,
  selectEntities,
  selectAll,
  selectTotal,
} = adapter.getSelectors();

export const selectAllCharacters = selectAll;
export const selectCharactersEntities = selectEntities;
