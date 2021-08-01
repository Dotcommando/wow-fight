import { createAction, props } from '@ngrx/store';

import { ICastedSpell } from '../../models/casted-spell.interface';
import { IBeastCharacter, IMainCharacter, InstanceOf } from '../../models/character.type';
import { IDamage } from '../../models/damage.interface';

export const setHitDamage = createAction(
  `[ DAMAGE ] Set Hit Damage`,
  props<{ damage: IDamage }>(),
);

export const setSpellDamage = createAction(
  `[ DAMAGE ] Set Spell Damage`,
  props<{
    spell: ICastedSpell;
    target: InstanceOf<IMainCharacter | IBeastCharacter>;
    assaulter: InstanceOf<IMainCharacter | IBeastCharacter>;
  }>(),
);

export const resetDamage = createAction(
  `[ DAMAGE ] Reset Damage`,
);
