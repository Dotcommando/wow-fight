import { NAMES } from '../constants/name.enum';
import { MASSIVENESS, SPELL_TARGET, SPELLS } from '../constants/spells.enum';
import { STAGE, STAGE_OF } from './casted-spell.interface';

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
  fireOnStage: STAGE;
  stageOf: STAGE_OF;
}
