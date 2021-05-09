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

export const playerMoveStarted = createAction(
  `[ PLAYER MOVE ] Started`,
);

export const playerMoveCompleted = createAction(
  `[ PLAYER MOVE ] Completed`,
);

export const playerBeastsMoveStarted = createAction(
  `[ PLAYER\'S BEASTS MOVE ] Started`,
);

export const playerBeastsMoveCompleted = createAction(
  `[ PLAYER\'S BEASTS MOVE ] Completed`,
);

export const CPUMoveStarted = createAction(
  `[ CPU MOVE ] Started`,
);

export const CPUMoveCompleted = createAction(
  `[ CPU MOVE ] Completed`,
);

export const CPUsBeastsMoveStarted = createAction(
  `[ CPU\'s BEASTS MOVE ] Started`,
);

export const CPUsBeastsMoveCompleted = createAction(
  `[ CPU\'s BEASTS MOVE ] Completed`,
);

export const moveCompleted = createAction(
  `[ MOVE ] Move Completed`,
);
