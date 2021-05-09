import { NAMES } from '../constants/name.enum';
import { MASSIVENESS, SPELL_TARGET, SPELLS } from '../constants/spells.enum';

export interface ISpell {
  name: SPELLS;
  target: SPELL_TARGET;
  massiveness: MASSIVENESS;
  duration: number;
  canNotAttack: boolean;
  canNotCast: boolean;
  addHP: boolean;
  reduceHP: boolean;
  callBeast: boolean;
  coolDown: number;
  HPDelta?: number;
  calledBeast?: NAMES;
}
