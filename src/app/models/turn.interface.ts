import { IActivity } from './activity.interface';

export interface ITurn {
  roundNumber: number;
  player: IActivity | null;
  cpu: IActivity | null;
  playerBeasts: IActivity[];
  cpuBeasts: IActivity[];
}
