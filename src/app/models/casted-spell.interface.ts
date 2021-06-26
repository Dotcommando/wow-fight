import { SPELLS } from '../constants/spells.enum';

export interface ICastedSpell {
  id: string;  // ID заклинания.
  spellName: SPELLS;   // Spell name.
  expiredIn: number;   // Через сколько ходов прекратит действовать.
  target: string;      // ID цели.
  assaulter: string;   // ID атакующего.
  calledBeastId?: string; // ID призванного сущетсва.
}
