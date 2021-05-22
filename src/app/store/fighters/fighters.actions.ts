import { createAction, props } from '@ngrx/store';

import { IBeastCharacter, IMainCharacter, InstanceOf } from '../../models/character.type';

export const addCharacter = createAction(
  `[ PARTIES ] Add One`,
  props< { character: InstanceOf<IMainCharacter | IBeastCharacter> }>(),
);

export const updateCharacter = createAction(
  `[ PARTIES ] Update One`,
  props< { character: InstanceOf<IMainCharacter | IBeastCharacter> }>(),
);

export const updateCharacters = createAction(
  `[ PARTIES ] Update Many`,
  props< { characters: InstanceOf<IMainCharacter | IBeastCharacter>[] }>(),
);

export const removeCharacter = createAction(
  `[ PARTIES ] Remove One`,
  props< { characterId: string }>(),
);

export const toggleCharacters = createAction(
  `[ PARTIES ] Toggle Characters`,
);
