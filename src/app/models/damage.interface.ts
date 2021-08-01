import { NAMES } from '../constants/name.enum';
import { SPELLS } from '../constants/spells.enum';
import { STATUSES } from '../constants/statuses.enum';
import { IBeastCharacter, IMainCharacter, InstanceOf } from './character.type';

export interface IBeastParams {
  beastName: NAMES;
  partyId: string;
  priority: number;
  status: STATUSES;
}

export interface IDamage {
  date: number;
  assaulter: string;
  target: string;
  isSpell: boolean;
  isHit: boolean;
  isSkip: boolean;
  critFired: boolean;
  targetChanges: {
    id: string;
    changes: Partial<InstanceOf<IMainCharacter | IBeastCharacter>>;
  } | null;
  damage: number;
  callBeast: boolean;
  spellName: SPELLS | null;
  spellId: string | null;
  beastParams: IBeastParams | null;
}
