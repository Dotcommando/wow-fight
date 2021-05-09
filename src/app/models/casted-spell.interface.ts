import { SPELLS } from '../constants/spells.enum';

export interface ICastedSpell {
  instanceId: string;  // ID заклинания.
  spellName: SPELLS;   // Spell name.
  expiredIn: number;   // Через сколько ходов прекратит действовать.
  turnsActive: number; // Ходов действует.
}
