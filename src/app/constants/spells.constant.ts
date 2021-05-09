import { ISpell } from '../models/spell-attributes.interface';
import { NAMES } from './name.enum';
import { MASSIVENESS, SPELL_TARGET, SPELLS } from './spells.enum';

export const SPELL_FEAR: ISpell = {
  name: SPELLS.FEAR,
  target: SPELL_TARGET.ENEMY,
  massiveness: MASSIVENESS.ONE,
  duration: 3,
  canNotAttack: true,
  canNotCast: false,
  addHP: false,
  reduceHP: false,
  callBeast: false,
  coolDown: 60,
};

export const SPELL_FILTH: ISpell = {
  name: SPELLS.FILTH,
  target: SPELL_TARGET.ENEMY,
  massiveness: MASSIVENESS.ONE,
  duration: 1,
  canNotAttack: false,
  canNotCast: false,
  addHP: false,
  reduceHP: true,
  HPDelta: 200,
  callBeast: false,
  coolDown: 10,
};

export const SPELL_ANCESTRAL_SPIRIT: ISpell = {
  name: SPELLS.ANCESTRAL_SPIRIT,
  target: SPELL_TARGET.SELF,
  massiveness: MASSIVENESS.ONE,
  duration: 1,
  canNotAttack: false,
  canNotCast: false,
  addHP: true,
  reduceHP: false,
  HPDelta: 500,
  callBeast: false,
  coolDown: 10,
};

export const SPELL_REBIRTH: ISpell = {
  name: SPELLS.REBIRTH,
  target: SPELL_TARGET.SELF,
  massiveness: MASSIVENESS.ONE,
  duration: 1,
  canNotAttack: false,
  canNotCast: false,
  addHP: false,
  reduceHP: false,
  callBeast: true,
  coolDown: 10,
  calledBeast: NAMES.SKELETON,
};

export const ALL_SPELLS: ISpell[] = [
  SPELL_ANCESTRAL_SPIRIT,
  SPELL_FEAR,
  SPELL_FILTH,
  SPELL_REBIRTH,
];
