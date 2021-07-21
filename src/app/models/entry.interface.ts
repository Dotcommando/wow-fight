import { IAttackState } from './attack-vectors.interface';
import { IBeastCharacter, IMainCharacter, InstanceOf } from './character.type';

export interface IEntry {
  id: number;
  date: string;
  attack?: IAttackState;
  damage: {
    id: string;
    changes: Partial<InstanceOf<IMainCharacter | IBeastCharacter>>;
  };
}
