import { IAttackVectors } from './attack-vectors.interface';
import { IAssaulterEnemies } from './player-enemies.interface';

export interface IAttackVectorProcessing {
  assaulterEnemies: IAssaulterEnemies;
  attackVector: IAttackVectors;
}
