import { PHASE } from '../constants/phase.constant';
import { ICastedSpell } from './casted-spell.interface';
import { IBeastCharacter, IMainCharacter, InstanceOf } from './character.type';
import { IPartiesIds } from './parties-ids.interface';
import { ITurn } from './turn.interface';

export interface IMainLoopData {
  turn: ITurn;
  phase: PHASE;
  spells: ICastedSpell;
  assaulterId: string;
  fighters: InstanceOf<IMainCharacter | IBeastCharacter>[];
  partiesIds: IPartiesIds;
}
