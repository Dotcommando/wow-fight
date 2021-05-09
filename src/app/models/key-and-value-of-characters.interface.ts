import { IBeastCharacter, IMainCharacter, InstanceOf } from './character.type';
import { ValueOf } from './value-of.type';

export interface IKeyAndValueOfCharacters {
  prop: keyof InstanceOf<IMainCharacter | IBeastCharacter>;
  value: ValueOf<InstanceOf<IMainCharacter | IBeastCharacter>>;
}
