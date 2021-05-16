import { SPELL_TARGET } from '../constants/spells.enum';

export interface ITarget { id: string; name: string }

export interface ISpellShort { name: string; party: SPELL_TARGET; nameOfBeast?: string }

export interface IAttackVectors {
  hit?: ITarget[];
  cast?: Array<{ target?: ITarget; spell: ISpellShort }>;
  skip?: boolean;
}
