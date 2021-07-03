import { ITurn } from '../models/turn.interface';

export const DEFAULT_TURN: ITurn = {
  roundNumber: 1,
  activeParty: '',
  movingFighter: '',
  phase: null,
};
