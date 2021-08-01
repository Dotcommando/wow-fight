import { createFeatureSelector } from '@ngrx/store';

import { IDamage } from '../../models/damage.interface';
import { damageFeatureKey } from './damage.reducer';


export const selectDamage = createFeatureSelector<IDamage>(damageFeatureKey);
