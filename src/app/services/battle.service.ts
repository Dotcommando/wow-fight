import { Injectable } from '@angular/core';

import { BehaviorSubject, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class BattleService {
  private gameEndedSubject$ = new BehaviorSubject<boolean>(false);
  public gameEnded$ = this.gameEndedSubject$.asObservable();

  private playerMoveCompletedSubject$ = new Subject<void>();
  public playerMoveCompleted$ = this.playerMoveCompletedSubject$.asObservable();

  private currentRoundSubject$ = new BehaviorSubject<number>(1);
  public currentRound$ = this.currentRoundSubject$.asObservable();

  public emitPlayerMoveCompleted(): void {
    this.playerMoveCompletedSubject$.next();
  }

  public incrementRound(): number {
    const nextRound = this.currentRoundSubject$.value + 1;
    this.currentRoundSubject$.next(nextRound);
    return nextRound;
  }

  public getCurrentRound(): number {
    return this.currentRoundSubject$.value;
  }

  public onGameStarted(): void {
    console.log('Game Started');
  }

  public onTurnStarted(): void {
    console.log('Turn Started');
  }

  public onPlayerMoveStarted(): void {
    console.log('Player Move Started');
  }

  public onPlayerMoveCompleted(): void {
    console.log('Player Move Completed');
  }

  public onPlayerBeastsMoveStarted(): void {
    console.log('Player Beasts Move Started');
  }

  public onPlayerBeastsMoveCompleted(): void {
    console.log('Player Beasts Move Completed');
  }

  public onCpuMoveStarted(): void {
    console.log('CPU Move Started');
  }

  public onCpuMoveCompleted(): void {
    console.log('CPU Move Completed');
  }

  public onCpuBeastsMoveStarted(): void {
    console.log('CPU Beasts Move Started');
  }

  public onCpuBestsMoveCompleted(): void {
    console.log('CPU Beasts Move Completed');
    this.incrementRound();
  }

  public onTurnCompleted(): void {
    console.log('Turn Completed');
  }

  public getGameEnded(): boolean {
    return this.gameEndedSubject$.value;
  }
}
