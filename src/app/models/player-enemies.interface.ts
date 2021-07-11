import { ICastedSpell } from './casted-spell.interface';
import { IBeastCharacter, IMainCharacter, InstanceOf } from './character.type';

export interface IAssaulterEnemies {
  assaulter: InstanceOf<IMainCharacter | IBeastCharacter>;
  enemies: InstanceOf<IMainCharacter | IBeastCharacter>[];
  spells: ICastedSpell[];
}
