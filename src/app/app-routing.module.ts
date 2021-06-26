import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AppComponent } from './app.component';
import { BattleComponent } from './battle/battle.component';
import { StartComponent } from './start/start.component';


const routes: Routes = [
  { path: '', pathMatch: 'full', component: StartComponent },
  { path: 'battle', component: BattleComponent },
  { path: 'result', component: AppComponent },
  // { path: '**', component: NotFoundComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule { }
