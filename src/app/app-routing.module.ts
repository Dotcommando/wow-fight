import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AppComponent } from './app.component';
import { BattleComponent } from './battle/battle.component';
import { GameStartedGuard } from './guards/game-started.guard';
import { StartComponent } from './start/start.component';


const routes: Routes = [
  { path: '', pathMatch: 'full', component: StartComponent },
  { path: 'battle', component: BattleComponent, canActivate: [GameStartedGuard]},
  { path: 'result', component: AppComponent },
  { path: '**', redirectTo: '', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule { }
