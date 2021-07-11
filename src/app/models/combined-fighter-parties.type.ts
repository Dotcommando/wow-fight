import { ICastedSpell } from './casted-spell.interface';
import { IBeastCharacter, IMainCharacter, InstanceOf } from './character.type';

export type CombinedFightersParties = [
  assaulterId: string,
  fighters: InstanceOf<IMainCharacter | IBeastCharacter>[],
  parties: { playerPartyId: string; cpuPartyId: string },
  spells: ICastedSpell[],
];
