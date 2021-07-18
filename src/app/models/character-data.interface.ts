import { NAMES } from '../constants/name.enum';
import { SPELLS } from '../constants/spells.enum';

export interface ICharacterData {
  name: NAMES;
  strength: number;
  agility: number;
  intellect: number;
  stamina: number;
  spells: SPELLS[];
  dps?: number;
  hp?: number;
  crit?: number;
}
