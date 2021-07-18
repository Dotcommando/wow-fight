import { NAMES } from './name.enum';
import { SPELLS } from './spells.enum';

export const CHARACTERS_START_DATA = {
  [ NAMES.GULDAN ]: {
    name: NAMES.GULDAN,
    strength: 30,
    agility: 20,
    intellect: 150,
    stamina: 120,
    spells: [
      SPELLS.FEAR,
      SPELLS.FILTH,
    ],
  },
  [ NAMES.NERZHUL ]: {
    name: NAMES.NERZHUL,
    strength: 40,
    agility: 50,
    intellect: 120,
    stamina: 160,
    spells: [
      SPELLS.ANCESTRAL_SPIRIT,
      SPELLS.REBIRTH,
    ],
  },
};
