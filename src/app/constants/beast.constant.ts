import { IBeastCharacter } from '../models/character.type';
import { NAMES } from './name.enum';

export const SKELETON: IBeastCharacter = {
  name: NAMES.SKELETON,
  canNotAttack: false,
  canNotCast: true,
  inheritedDps: 100,
  inheritedHp: 300,
  inheritedCrit: 0,
};
