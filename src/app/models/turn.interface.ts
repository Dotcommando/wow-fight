import { IActivity } from './activity.interface';

export interface ITurn {
  roundNumber: number;
  player: IActivity;
  cpu: IActivity;
  playerBeasts: IActivity[];
  cpuBeasts: IActivity[];
}
