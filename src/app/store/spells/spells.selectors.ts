import { createFeatureSelector, createSelector } from '@ngrx/store';

import { ISpellsState, selectAllSpells, spellsFeatureKey } from './spells.reducer';

export const selectedSpells = createFeatureSelector<ISpellsState>(spellsFeatureKey);

export const selectSpells = createSelector(
  selectedSpells,
  selectAllSpells,
);
