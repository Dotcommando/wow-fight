import { createEntityAdapter, EntityAdapter, EntityState } from '@ngrx/entity';
import { Action, createReducer, on } from '@ngrx/store';

import { UUID } from 'angular2-uuid';

import { NAMES } from '../../constants/name.enum';
import { SPELL_ANCESTRAL_SPIRIT, SPELL_FEAR, SPELL_FILTH, SPELL_REBIRTH } from '../../constants/spells.constant';
import { SPELL_TARGET, SPELLS } from '../../constants/spells.enum';
import { STATUSES } from '../../constants/statuses.enum';
import { createCharacter } from '../../helpers/create-character.helper';
import { IAttack, ISpellShort } from '../../models/attack-vectors.interface';
import { ICastedSpell } from '../../models/casted-spell.interface';
import { IBeastCharacter, IMainCharacter, InstanceOf } from '../../models/character.type';
import { addCharacter, moveCompleted, removeCharacter, toggleCharacters, updateCharacter, updateCharacters } from './fighters.actions';


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
          changes: { ...cpu, status: player.status, id: player.id, partyId: player.partyId, priority: 10 },
        },
        {
          id: cpu.id,
          changes: { ...player, status: cpu.status, id: cpu.id, partyId: cpu.partyId, priority: 20 },
        },
      ], state);
    },
  ),
  on(moveCompleted,
    (state, { attack, assaulter }: { attack: IAttack; assaulter: InstanceOf<IMainCharacter> }) => {

      if (!attack) {
        return adapter.updateMany([], state);
      }

      const assaulterId = assaulter.id;
      const targetId = attack?.target?.id ?? null;

      if (targetId) {
        const target: InstanceOf<IMainCharacter | IBeastCharacter> | undefined = state.entities[targetId];

        if (!target) {
          throw new Error('Target of attack not found.');
        }

        if (attack.hit) {
          const critHappened = Math.random() > assaulter.crit;
          const damage = assaulter.dps * (critHappened ? 1.5 : 1);
          const resultHp = target.hp - damage;
          const targetChanges: Partial<InstanceOf<IMainCharacter | IBeastCharacter>> = {
            hp: resultHp >= 0 ? resultHp : 0,
            isAlive: resultHp > 0,
          };

          return adapter.updateOne({
            id: targetId,
            changes: targetChanges,
          }, state);
        } else {
          if (!attack.spell) {
            throw new Error('Attack must contain a spell at this case.');
          }

          const spellShort: ISpellShort = attack.spell;

          if (spellShort.party === SPELL_TARGET.ENEMY) {
            const spellName = spellShort.name as SPELLS;
            let duration: number = 0;

            if (spellName === SPELLS.FEAR) {
              duration = SPELL_FEAR.duration;
            } else if (spellName === SPELLS.FILTH) {
              duration = SPELL_FILTH.duration;
            }

            if (spellShort.name === SPELLS.FEAR) {
              const newSpellCasted: ICastedSpell = {
                id: UUID.UUID(),
                spellName: spellName,
                expiredIn: duration,
                target: targetId,
                assaulter: assaulterId,
              };

              const assaulterChanges: Partial<InstanceOf<IMainCharacter | IBeastCharacter>> = {
                spellsCasted: [
                  ...assaulter.spellsCasted,
                  newSpellCasted,
                ],
              };

              const targetChanges: Partial<InstanceOf<IMainCharacter | IBeastCharacter>> = {
                spellBound: [
                  ...target.spellBound,
                  newSpellCasted,
                ],
              };

              return adapter.updateMany([
                {
                  id: assaulterId,
                  changes: assaulterChanges,
                },
                {
                  id: targetId,
                  changes: targetChanges,
                },
              ], state);
            }
          } else if (spellShort.party === SPELL_TARGET.SELF) {
            const spellName = SPELLS.ANCESTRAL_SPIRIT;
            const duration = SPELL_ANCESTRAL_SPIRIT.duration;

            const newSpellCasted: ICastedSpell = {
              id: UUID.UUID(),
              spellName: spellName,
              expiredIn: duration,
              target: targetId,
              assaulter: assaulterId,
            };

            const assaulterChanges: Partial<InstanceOf<IMainCharacter | IBeastCharacter>> = {
              spellsCasted: [
                ...assaulter.spellsCasted,
                newSpellCasted,
              ],
              spellBound: [
                ...target.spellBound,
                newSpellCasted,
              ],
            };

            return adapter.updateOne({
              id: assaulterId,
              changes: assaulterChanges,
            }, state);
          }
        }
      } else {
        // There is SPELL_TARGET.CALL
        const spellName = SPELLS.REBIRTH;
        const duration = SPELL_REBIRTH.duration;

        const newSpellCasted: ICastedSpell = {
          id: UUID.UUID(),
          spellName: spellName,
          expiredIn: duration,
          target: targetId,
          assaulter: assaulterId,
        };

        const assaulterChanges: Partial<InstanceOf<IMainCharacter | IBeastCharacter>> = {
          spellsCasted: [
            ...assaulter.spellsCasted,
            newSpellCasted,
          ],
        };

        return adapter.updateOne({
          id: assaulterId,
          changes: assaulterChanges,
        }, state);
      }

      return adapter.updateOne(
        {
          id: assaulter.id,
          changes: {},
        },
        state,
      );
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
