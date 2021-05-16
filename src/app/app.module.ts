import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatRadioModule } from '@angular/material/radio';
import { BrowserModule } from '@angular/platform-browser';

import { StoreModule } from '@ngrx/store';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';

import { environment } from '../environments/environment';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
// import { AttackComponent } from './attack/attack.component';
import { BattleComponent } from './battle/battle.component';
import { CharacterCardComponent } from './battle/character-card/character-card.component';
import { ParsePipe } from './pipes/parse.pipe';
import { RoundPipe } from './pipes/round.pipe';
import { StartComponent } from './start/start.component';
import { AppStoreModule } from './store/app-store.module';
import { AttackComponent } from './attack/attack.component';

@NgModule({
  declarations: [
    AppComponent,
    StartComponent,
    BattleComponent,
    CharacterCardComponent,
    // AttackComponent,
    RoundPipe,
    ParsePipe,
    AttackComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    MatRadioModule,
    MatButtonModule,
    StoreModule.forRoot({}, {}),
    StoreDevtoolsModule.instrument({ maxAge: 50, logOnly: environment.production }),

    AppStoreModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule { }
