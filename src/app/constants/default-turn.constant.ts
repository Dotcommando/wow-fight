import { ITurnState } from '../models/turn.interface';

export const DEFAULT_TURN: ITurnState = {
  roundNumber: 1,
  activeParty: '',
  movingFighter: '',
  phase: null,
  winner: null,
};
