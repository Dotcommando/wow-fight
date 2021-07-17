import { createAction, props } from '@ngrx/store';

import { ICastedSpell } from '../../models/casted-spell.interface';
import { IBeastCharacter, IMainCharacter, InstanceOf } from '../../models/character.type';


export const updateCharacters = createAction(
  `[ FIGHTERS ] Update Many`,
  props< { changes: { id: string; changes: Partial<InstanceOf<IMainCharacter | IBeastCharacter>> }[]}>(),
);

export const toggleCharacters = createAction(
  `[ FIGHTERS ] Toggle Characters`,
);

export const moveStarted = createAction(
  `[ FIGHTERS ] Move Started`,
);

export const playerMoveStarted = createAction(
  `[ FIGHTERS ] Player's Move Started`,
);

export const moveCompleted = createAction(
  `[ FIGHTERS ] Move Completed`,
  props<{ id: string }>(),
);

export const applySpellToCharacter = createAction(
  `[ FIGHTERS ] Apply Spell to Fighter`,
  props<{ fighterId: string; spell: ICastedSpell }>(),
);

export const applyHit = createAction(
  `[ FIGHTERS ] Apply Hit`,
  props<{ id: string; changes: Partial<InstanceOf<IMainCharacter | IBeastCharacter>> }>(),
);

export const resetMoveStatus = createAction(
  `[ FIGHTERS ] Reset Move Status`,
);

export const clearDeadBeasts = createAction(
  `[ FIGHTERS ] Clear Dead Beasts`,
);

export const restoreFighterAfterSpell = createAction(
  `[ SPELLS ] Restore Fighter After Spell`,
  props<{ spell: ICastedSpell }>(),
);
