import { IMultipliers } from '../models/multipliers.interface';

export const MULTIPLIERS: IMultipliers = {
  strength: {
    dps: 1.5,
    hp: 2,
    crit: 0,
  },
  agility: {
    dps: 1,
    hp: 0,
    crit: 0.002,
  },
  intellect: {
    dps: 1,
    hp: 0,
    crit: 0.0005,
  },
  stamina: {
    dps: 0,
    hp: 10,
    crit: 0,
  },
};
