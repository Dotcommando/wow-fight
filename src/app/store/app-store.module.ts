import { NgModule } from '@angular/core';

import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';

import { AttacksEffects } from './attacks/attacks.effects';
import * as fromAttacksReducer from './attacks/attacks.reducer';
import { AttackVectorsEffects } from './attackVectors/attack-vectors.effects';
import * as fromAttackVectorsReducer from './attackVectors/attack-vectors.reducer';
import { FightersEffects } from './fighters/fighters.effects';
import * as fromFightersReducer from './fighters/fighters.reducer';
import { SpellsEffects } from './spells/spells.effects';
import * as fromSpellsReducer from './spells/spells.reducer';
import { TurnEffects } from './turn/turn.effects';
import * as fromTurnReducer from './turn/turn.reducer';


@NgModule({
  imports: [
    StoreModule.forFeature(fromFightersReducer.fightersFeatureKey, fromFightersReducer.reducer),
    StoreModule.forFeature(fromTurnReducer.turnFeatureKey, fromTurnReducer.reducer),
    StoreModule.forFeature(fromSpellsReducer.spellsFeatureKey, fromSpellsReducer.reducer),
    StoreModule.forFeature(fromAttacksReducer.attackFeatureKey, fromAttacksReducer.reducer),
    StoreModule.forFeature(fromAttackVectorsReducer.attackVectorsFeatureKey, fromAttackVectorsReducer.reducer),
    EffectsModule.forRoot([ TurnEffects, FightersEffects, AttacksEffects, SpellsEffects, AttackVectorsEffects ]),
  ],
})
export class AppStoreModule {
}
