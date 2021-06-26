import { TypedAction } from '@ngrx/store/src/models';

import { Attack } from './attack-vectors.interface';
import { IMainCharacter, InstanceOf } from './character.type';

export type PlayerMoveCompletedActionType = { playerAttack: Attack; assaulter: InstanceOf<IMainCharacter> } & TypedAction<'[ PLAYER ] Move Completed'>;
