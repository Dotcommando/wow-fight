import { PHASE } from '../constants/phase.constant';

export interface ITurn {
  roundNumber: number;
  activeParty: string;
  movingFighter: string;
  phase: PHASE | null;
}
