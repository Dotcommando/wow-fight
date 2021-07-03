import { NgModule } from '@angular/core';

import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';

import { FightersEffects } from './fighters/fighters.effects';
import * as fromFightersReducer from './fighters/fighters.reducer';
import * as fromSpellsReducer from './spells/spells.reducer';
import { TurnEffects } from './turn/turn.effects';
import * as fromTurnReducer from './turn/turn.reducer';


@NgModule({
  imports: [
    StoreModule.forFeature(fromFightersReducer.fightersFeatureKey, fromFightersReducer.reducer),
    StoreModule.forFeature(fromTurnReducer.turnFeatureKey, fromTurnReducer.reducer),
    StoreModule.forFeature(fromSpellsReducer.spellsFeatureKey, fromSpellsReducer.reducer),
    EffectsModule.forRoot([ TurnEffects, FightersEffects ]),
  ],
})
export class AppStoreModule {
}
