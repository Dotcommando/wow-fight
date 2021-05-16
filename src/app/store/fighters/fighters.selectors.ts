import { createFeatureSelector, createSelector } from '@ngrx/store';

import { STATUSES } from '../../constants/statuses.enum';
import { IBeastCharacter, IMainCharacter, InstanceOf } from '../../models/character.type';
import { IKeyAndValueOfCharacters } from '../../models/key-and-value-of-characters.interface';
import { fightersFeatureKey, IFightersState, selectAllCharacters } from './fighters.reducer';


export const selectedFighters = createFeatureSelector<IFightersState>(fightersFeatureKey);

/**
 * @description - Returns all Characters and Beasts.
 */
export const selectCharacters = createSelector(
  selectedFighters,
  selectAllCharacters,
);

/**
 * @description - Returns all Characters and Beasts filtered by Prop and its value.
 */
export const selectCharactersByProp = (state: IFightersState, { prop, value }: IKeyAndValueOfCharacters): Array<InstanceOf<IMainCharacter |IBeastCharacter>> =>
  selectAllCharacters(state).filter(character => character[ prop ] === value);

/**
 * @description - Returns one Character or Beast found by Prop and its value.
 */
export const selectCharacterByProp = (state: IFightersState, { prop, value }: IKeyAndValueOfCharacters): InstanceOf<IMainCharacter |IBeastCharacter> | null =>
  selectAllCharacters(state).find(character => character[prop] === value) ?? null;

export const selectPlayerCharacter = createSelector(
  selectedFighters,
  (state: IFightersState): InstanceOf<IMainCharacter | IBeastCharacter> | null => selectCharacterByProp(state, { prop: 'status', value: STATUSES.PLAYER }),
);

export const selectCPUCharacter = createSelector(
  selectedFighters,
  (state: IFightersState): InstanceOf<IMainCharacter | IBeastCharacter> | null => selectCharacterByProp(state, { prop: 'status', value: STATUSES.CPU }),
);

export const selectPlayerBeasts = createSelector(
  selectedFighters,
  (state: IFightersState) => selectCharactersByProp(state, { prop: 'status', value: STATUSES.PLAYERS_BEAST }),
);

export const selectCPUBeasts = createSelector(
  selectedFighters,
  (state: IFightersState) => selectCharactersByProp(state, { prop: 'status', value: STATUSES.CPUS_BEAST }),
);

export const selectParties = createSelector(
  selectedFighters,
  (state: IFightersState) => ({ playerPartyId: state.playerPartyId, cpuPartyId: state.cpuPartyId }),
);
