import { IBeastCharacter } from '../models/character.type';
import { NAMES } from './name.enum';

export const SKELETON: IBeastCharacter = {
  name: NAMES.SKELETON,
  canNotAttack: false,
  canNotCast: true,
  spellsCasted: [],
  spellBound: [],
  inheritedDps: 100,
  inheritedHp: 300,
  inheritedCrit: 0,
};

export const BEASTS = [
  SKELETON,
];
