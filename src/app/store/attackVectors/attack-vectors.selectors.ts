import { createFeatureSelector } from '@ngrx/store';

import { IAttackVectors } from '../../models/attack-vectors.interface';
import { attackVectorsFeatureKey } from './attack-vectors.reducer';


export const selectAttackVectors = createFeatureSelector<IAttackVectors>(attackVectorsFeatureKey);
