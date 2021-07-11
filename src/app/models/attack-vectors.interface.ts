import { SPELL_TARGET } from '../constants/spells.enum';

export interface ICharacterShort { id: string; name: string }

export interface ISpellShort { name: string; party: SPELL_TARGET; nameOfBeast?: string }

export interface IAttackVectors {
  hit?: Array<{ target: ICharacterShort; spell: null; hit: true }>;
  cast?: Array<{ target?: ICharacterShort; spell: ISpellShort; hit: false }>;
  skip?: boolean;
}

export interface IHitAttack { target: ICharacterShort; hit: true }

export interface ISpellAttack { target: ICharacterShort; spell: ISpellShort }

export interface IAttack {
  target: ICharacterShort;
  spell: ISpellShort | null;
  hit: boolean;
}

export type AttackVector = {
  hit: IHitAttack[];
} | {
  cast: ISpellAttack[];
} | {
  skip: boolean;
}

export interface IAttackState {
  assaulter: ICharacterShort | null;
  target: ICharacterShort | null;
  hit: boolean;
  spell: ISpellShort | null;
  skip: boolean;
}
