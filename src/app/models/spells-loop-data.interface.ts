import { IAttackState } from './attack-vectors.interface';
import { ICastedSpell } from './casted-spell.interface';
import { IBeastCharacter, IMainCharacter, InstanceOf } from './character.type';
import { ITurnState } from './turn.interface';

export interface ISpellsLoopData {
  characters: InstanceOf<IMainCharacter | IBeastCharacter>[];
  parties: { playerPartyId: string; cpuPartyId: string };
  spells: ICastedSpell[];
  currentTurn: ITurnState;
  attack: IAttackState;
}
