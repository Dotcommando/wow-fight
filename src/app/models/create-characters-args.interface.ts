import { NAMES } from '../constants/name.enum';
import { STATUSES } from '../constants/statuses.enum';

export interface ICreateCharacterArgs {
  id?: string;
  name: NAMES;
  party: string;
  status: STATUSES;
  canNotAttack: boolean;
  canNotCast: boolean;
  priority: number;
}
