import { SPELL_TARGET } from '../constants/spells.enum';

export interface ITarget { id: string; name: string }

export interface ISpellShort { name: string; party: SPELL_TARGET; nameOfBeast?: string }

export interface IAttackVectors {
  hit?: Array<{ target: ITarget; hit: true }>;
  cast?: Array<{ target?: ITarget; spell: ISpellShort }>;
  skip?: boolean;
}

export type AttackVector = {
  hit: Array<{ target: ITarget; hit: true }>;
} | {
  cast: Array<{ target?: ITarget; spell: ISpellShort }>;
} | {
  skip: boolean;
}
