import { ATTACK_METHOD } from '../constants/attack-method.enum';
import { ICastedSpell } from './casted-spell.interface';

export interface IActivity {
  method: ATTACK_METHOD;
  castedSpells?: ICastedSpell;
  target: string; // ID
  assaulter: string; // ID
  critFired: boolean | null;
  damage: number;
}
