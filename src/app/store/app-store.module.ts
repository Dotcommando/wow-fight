import { NgModule } from '@angular/core';

import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';

// import { FightersEffects } from './parties/fighters.effects';
import { BattleEffects } from './battle/battle.effects';
import * as fromBattleReducer from './battle/battle.reducer';
import * as fromFightersReducer from './fighters/fighters.reducer';


@NgModule({
  imports: [
    StoreModule.forFeature(fromFightersReducer.fightersFeatureKey, fromFightersReducer.reducer),
    StoreModule.forFeature(fromBattleReducer.battleFeatureKey, fromBattleReducer.reducer),
    EffectsModule.forRoot([BattleEffects]),
  ],
})
export class AppStoreModule {
}
