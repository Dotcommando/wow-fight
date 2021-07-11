import { Injectable } from '@angular/core';

import { Actions, createEffect, CreateEffectMetadata, ofType } from '@ngrx/effects';

import { map, switchMap, takeUntil, tap } from 'rxjs/operators';

import { DEFAULT_TURN } from '../../constants/default-turn.constant';
import { PHASE } from '../../constants/phase.constant';
import { BattleService } from '../../services/battle.service';
import { fighterHasStartedMove } from '../fighters/fighters.actions';
import {
  gameEnded,
  gameStarted,
  turnCompleted,
  turnStarted,
} from './turn.actions';


@Injectable()
export class TurnEffects {
  public gameStarted$ = this.gameStartedFn$();
  public turnStarted$ = this.turnStartedFn$();
  public moveStarted$ = this.moveStartedFn$();
  // public moveCompleted$ = this.moveCompletedFn$();
  public turnCompleted$ = this.turnCompletedFn$();
  public gameEnded$ = this.gameEndedFn$();

  constructor(
    private actions$: Actions,
    private battleService: BattleService,
  ) {
  }

  private gameStartedFn$(): CreateEffectMetadata {
    return createEffect(() => this.actions$.pipe(
      ofType(gameStarted),
      tap(() => this.battleService.onGameStarted()),
      map(({ playerId, playerPartyId }) => turnStarted({
        turn: {
          ...DEFAULT_TURN,
          roundNumber: this.battleService.getCurrentRound(),
          activeParty: playerPartyId,
          movingFighter: playerId,
        },
      })),
    ));
  }

  private moveStartedFn$(): CreateEffectMetadata {
    return createEffect(() => this.actions$.pipe(
      ofType(fighterHasStartedMove),
      tap(() => this.battleService.onPlayerMoveStarted()),
      switchMap(() => this.battleService.calculateAttackVectors$),
    ), { dispatch: false });
  }

  // private moveCompletedFn$(): CreateEffectMetadata {
  //   return createEffect(() => this.actions$.pipe(
  //     ofType(moveCompleted),
  //     tap(() => this.battleService.onPlayerMoveCompleted()),
  //     switchMap(({ playerAttack, assaulter }: PlayerMoveCompletedActionType) => this.battleService.applyPlayerAttack(playerAttack, assaulter)),
  //     map(() => playerBeastsMoveStarted()),
  //     takeUntil(this.battleService.gameEnded$),
  //   ));
  // }

  // private cpuMoveStartedFn$(): CreateEffectMetadata {
  //   return createEffect(() => this.actions$.pipe(
  //     ofType(cpuMoveStarted),
  //     tap(() => this.battleService.onCpuMoveStarted()),
  //     map(() => cpuMoveCompleted()),
  //     takeUntil(this.battleService.gameEnded$),
  //   ));
  // }

  // private cpuMoveCompletedFn$(): CreateEffectMetadata {
  //   return createEffect(() => this.actions$.pipe(
  //     ofType(cpuMoveCompleted),
  //     tap(() => this.battleService.onCpuMoveCompleted()),
  //     map(() => cpuBeastsMoveStarted()),
  //     takeUntil(this.battleService.gameEnded$),
  //   ));
  // }

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
      map(() => fighterHasStartedMove()),
    ));
  }

  private gameEndedFn$(): CreateEffectMetadata {
    return createEffect(() => this.actions$.pipe(
      ofType(gameEnded),
      tap(() => this.battleService.onGameEnded()),
    ), { dispatch: false });
  }
}
