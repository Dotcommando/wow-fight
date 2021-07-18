import { createFeatureSelector } from '@ngrx/store';

import { IAttackState } from '../../models/attack-vectors.interface';
import { attackFeatureKey } from './attacks.reducer';

export const selectAttack = createFeatureSelector<IAttackState>(attackFeatureKey);
