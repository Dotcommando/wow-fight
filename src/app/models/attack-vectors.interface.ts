import { SPELL_TARGET } from '../constants/spells.enum';

export interface ITarget { id: string; name: string }

export interface ISpellShort { name: string; party: SPELL_TARGET; nameOfBeast?: string }

export interface IAttackVectors {
  hit?: Array<{ target: ITarget; spell: null; hit: true }>;
  cast?: Array<{ target?: ITarget; spell: ISpellShort; hit: false }>;
  skip?: boolean;
}

export interface IHitAttack { target: ITarget; hit: true }

export interface ISpellAttack { target: ITarget; spell: ISpellShort }

export interface IAttack {
  target: ITarget;
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

export type Attack = IHitAttack | ISpellAttack | null;
