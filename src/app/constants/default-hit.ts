import { IDamage } from '../models/damage.interface';

export const defaultHit: IDamage = {
  targetChanges: null,
  date: new Date().getTime(),
  assaulter: '',
  target: '',
  isSpell: false,
  isHit: true,
  isSkip: false,
  critFired: false,
  damage: 0,
  spellId: null,
  spellName: null,
  callBeast: false,
  beastParams: null,
};
