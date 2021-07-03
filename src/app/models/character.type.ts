import { MOVE_STATUSES } from '../constants/move-statuses.enum';
import { NAMES } from '../constants/name.enum';
import { SPELLS } from '../constants/spells.enum';
import { STATUSES } from '../constants/statuses.enum';
import { ICastedSpell } from './casted-spell.interface';

export interface IMainCharacter {
  name: NAMES;
  inheritedStrength: number;
  inheritedAgility: number;
  inheritedIntellect: number;
  inheritedStamina: number;
  canNotAttack: boolean;
  canNotCast: boolean;
  spells?: SPELLS[];
}

export interface IBeastCharacter {
  name: NAMES;
  inheritedDps: number;
  inheritedHp: number;
  inheritedCrit: number;
  canNotAttack: boolean;
  canNotCast: boolean;
  spells?: SPELLS[];
}

export type InstanceOf<T> = T & {
  id: string;
  partyId: string;
  priority: number;
  isAlive: boolean;
  slug: string;
  status: STATUSES;
  strength?: number;
  agility?: number;
  intellect?: number;
  stamina?: number;
  inheritedDps: number;
  inheritedHp: number;
  inheritedCrit: number;
  dps: number;
  hp: number;
  crit: number;
  spellsCasted: ICastedSpell[];
  spellBound: ICastedSpell[];
  move: MOVE_STATUSES | null;
}
