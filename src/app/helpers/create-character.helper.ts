import { UUID } from 'angular2-uuid';

import { CHARACTERS_START_DATA } from '../constants/characters-data.constant';
import { MOVE_STATUSES } from '../constants/move-statuses.enum';
import { NAMES } from '../constants/name.enum';
import { IBeastCharacter, IMainCharacter, InstanceOf } from '../models/character.type';
import { ICreateCharacterArgs } from '../models/create-characters-args.interface';
import { calculateBasicParams } from './calculate-basic-params.helper';
import { SKELETON } from '../constants/beast.constant';
import { STATUSES } from '../constants/statuses.enum';

export function createCharacter(
  {
    name,
    party,
    status,
    id,
    canNotAttack,
    canNotCast,
    priority,
  }: ICreateCharacterArgs,
): InstanceOf<IMainCharacter> {
  if (!id) {
    id = UUID.UUID();
  }

  // @ts-ignore
  const characterData = CHARACTERS_START_DATA[ name ];
  const calculatedParams = calculateBasicParams(characterData);
  const slug = name.replace(/'/g, '').toLowerCase();

  return {
    id,
    partyId: party,
    priority,
    isAlive: true,
    slug,
    status,
    strength: characterData.strength,
    agility: characterData.agility,
    intellect: characterData.intellect,
    stamina: characterData.stamina,
    inheritedDps: calculatedParams.dps,
    inheritedHp: calculatedParams.hp,
    inheritedCrit: calculatedParams.crit,
    dps: calculatedParams.dps,
    hp: calculatedParams.hp,
    crit: calculatedParams.crit,

    name: characterData.name,
    inheritedStrength: characterData.strength,
    inheritedAgility: characterData.agility,
    inheritedIntellect: characterData.intellect,
    inheritedStamina: characterData.stamina,
    canNotAttack: canNotAttack ?? false,
    canNotCast: canNotCast ?? false,
    spells: characterData.spells,

    move: MOVE_STATUSES.NOT_MOVED,
  };
}

export function createBeast(name: NAMES, partyId: string, priority: number, status: STATUSES): InstanceOf<IBeastCharacter> {
  switch (name) {
    case NAMES.SKELETON:
      return {
        ...SKELETON,

        id: UUID.UUID(),
        partyId,
        priority,
        isAlive: true,
        slug: name.replace(/'/g, '').toLowerCase(),
        status,
        dps: SKELETON.inheritedDps,
        hp: SKELETON.inheritedHp,
        crit: SKELETON.inheritedCrit,

        move: MOVE_STATUSES.NOT_MOVED,
      };

    default:
      return {
        ...SKELETON,

        id: UUID.UUID(),
        partyId,
        priority,
        isAlive: true,
        slug: name.replace(/'/g, '').toLowerCase(),
        status,
        dps: SKELETON.inheritedDps,
        hp: SKELETON.inheritedHp,
        crit: SKELETON.inheritedCrit,

        move: MOVE_STATUSES.NOT_MOVED,
      };
  }
}
