import { createAction, props } from '@ngrx/store';

import { IAttack } from '../../models/attack-vectors.interface';
import { IBeastCharacter, IMainCharacter, InstanceOf } from '../../models/character.type';

export const addCharacter = createAction(
  `[ FIGHTERS ] Add One`,
  props< { character: InstanceOf<IMainCharacter | IBeastCharacter> }>(),
);

export const updateCharacter = createAction(
  `[ FIGHTERS ] Update One`,
  props< { character: InstanceOf<IMainCharacter | IBeastCharacter> }>(),
);

export const updateCharacters = createAction(
  `[ FIGHTERS ] Update Many`,
  props< { characters: InstanceOf<IMainCharacter | IBeastCharacter>[] }>(),
);

export const nextFighter = createAction(
  `[ FIGHTERS ] Next character is active`,
  props< { prev: string; next: string } >(),
);

export const removeCharacter = createAction(
  `[ FIGHTERS ] Remove One`,
  props< { characterId: string }>(),
);

export const toggleCharacters = createAction(
  `[ FIGHTERS ] Toggle Characters`,
);

export const fighterHasStartedMove = createAction(
  `[ FIGHTERS ] Move Started`,
  // props<{ turn: ITurn }>(),
);

export const fighterHasCompletedMove = createAction(
  `[ FIGHTERS ] Move Completed`,
  props<{ attack: IAttack; assaulter: InstanceOf<IMainCharacter> }>(),
);
