import { TypedAction } from '@ngrx/store/src/models';

import { ICastedSpell } from './casted-spell.interface';
import { IBeastCharacter, IMainCharacter, InstanceOf } from './character.type';

export type CombinedFightersParties = [
  action: TypedAction<`[ TURN ] Calculation of Attack Vectors`>,
  assaulterId: string,
  fighters: InstanceOf<IMainCharacter | IBeastCharacter>[],
  parties: { playerPartyId: string; cpuPartyId: string },
  spells: ICastedSpell[],
];
