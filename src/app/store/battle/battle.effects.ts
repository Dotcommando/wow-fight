import { Injectable } from '@angular/core';

import { Actions, createEffect, CreateEffectMetadata, ofType } from '@ngrx/effects';

import { map, tap } from 'rxjs/operators';

import { DEFAULT_TURN } from '../../constants/default-turn.constant';
import { BattleService } from '../../services/battle.service';
import {
  cpuBeastsMoveCompleted,
  cpuBeastsMoveStarted,
  cpuMoveCompleted,
  cpuMoveStarted,
  gameStarted,
  playerBeastsMoveCompleted,
  playerBeastsMoveStarted,
  playerMoveCompleted,
  playerMoveStarted,
  turnCompleted,
  turnStarted,
} from './battle.actions';


@Injectable()
export class BattleEffects {
  public gameStarted$ = this.gameStartedFn$();
  public turnStarted$ = this.turnStartedFn$();
  public playerMoveStarted$ = this.playerMoveStartedFn$();
  public playerMoveCompleted$ = this.playerMoveCompletedFn$();
  public playerBeastsMoveStarted$ = this.playerBeastsMoveStartedFn$();
  public playerBeastsMoveCompleted$ = this.playerBeastsMoveCompletedFn$();
  public cpuMoveStarted$ = this.cpuMoveStartedFn$();
  public cpuMoveCompleted$ = this.cpuMoveCompletedFn$();
  public cpuBeastsMoveStarted$ = this.cpuBeastsMoveStartedFn$();
  public cpuBeastsMoveCompleted$ = this.cpuBeastsMoveCompletedFn$();
  public turnCompleted$ = this.turnCompletedFn$();

  constructor(
    private actions$: Actions,
    private battleService: BattleService,
  ) {
  }

  private gameStartedFn$(): CreateEffectMetadata {
    return createEffect(() => this.actions$.pipe(
      ofType(gameStarted),
      tap(() => this.battleService.onGameStarted()),
      map(() => turnStarted({
        turn: {
          ...DEFAULT_TURN,
          roundNumber: this.battleService.getCurrentRound(),
        },
      })),
    ));
  }

  private playerMoveStartedFn$(): CreateEffectMetadata {
    return createEffect(() => this.actions$.pipe(
      ofType(playerMoveStarted),
      tap(() => this.battleService.onPlayerMoveStarted()),
    ), { dispatch: false });
  }

  private playerMoveCompletedFn$(): CreateEffectMetadata {
    return createEffect(() => this.actions$.pipe(
      ofType(playerMoveCompleted),
      tap(() => this.battleService.onPlayerMoveCompleted()),
      map(() => playerBeastsMoveStarted()),
    ));
  }

  private playerBeastsMoveStartedFn$(): CreateEffectMetadata {
    return createEffect(() => this.actions$.pipe(
      ofType(playerBeastsMoveStarted),
      tap(() => this.battleService.onPlayerBeastsMoveStarted()),
      map(() => playerBeastsMoveCompleted()),
    ));
  }

  private playerBeastsMoveCompletedFn$(): CreateEffectMetadata {
    return createEffect(() => this.actions$.pipe(
      ofType(playerBeastsMoveCompleted),
      tap(() => this.battleService.onPlayerBeastsMoveCompleted()),
      map(() => cpuMoveStarted()),
    ));
  }

  private cpuMoveStartedFn$(): CreateEffectMetadata {
    return createEffect(() => this.actions$.pipe(
      ofType(cpuMoveStarted),
      tap(() => this.battleService.onCpuMoveStarted()),
      map(() => cpuMoveCompleted()),
    ));
  }

  private cpuMoveCompletedFn$(): CreateEffectMetadata {
    return createEffect(() => this.actions$.pipe(
      ofType(cpuMoveCompleted),
      tap(() => this.battleService.onCpuMoveCompleted()),
      map(() => cpuBeastsMoveStarted()),
    ));
  }

  private cpuBeastsMoveStartedFn$(): CreateEffectMetadata {
    return createEffect(() => this.actions$.pipe(
      ofType(cpuBeastsMoveStarted),
      tap(() => this.battleService.onCpuBeastsMoveStarted()),
      map(() => cpuBeastsMoveCompleted()),
    ));
  }

  private cpuBeastsMoveCompletedFn$(): CreateEffectMetadata {
    return createEffect(() => this.actions$.pipe(
      ofType(cpuBeastsMoveCompleted),
      tap(() => this.battleService.onCpuBestsMoveCompleted()),
      map(() => turnCompleted()),
    ));
  }

  private turnCompletedFn$(): CreateEffectMetadata {
    return createEffect(() => this.actions$.pipe(
      ofType(turnCompleted),
      tap(() => this.battleService.onTurnCompleted()),
      map(() => turnStarted({
        turn: {
          ...DEFAULT_TURN,
          roundNumber: this.battleService.getCurrentRound(),
        },
      })),
    ));
  }

  private turnStartedFn$(): CreateEffectMetadata {
    return createEffect(() => this.actions$.pipe(
      ofType(turnStarted),
      tap(() => this.battleService.onTurnStarted()),
      map(() => playerMoveStarted()),
    ));
  }
}
