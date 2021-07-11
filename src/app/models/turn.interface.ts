import { PHASE } from '../constants/phase.constant';

export interface ITurnState {
  roundNumber: number;
  activeParty: string;
  movingFighter: string;
  phase: PHASE | null;
}
