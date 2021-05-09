import { Injectable } from '@angular/core';

import { Store } from '@ngrx/store';

import { BehaviorSubject, Subject } from 'rxjs';

import { gameEnded } from '../store/battle/battle.actions';

@Injectable({
  providedIn: 'root',
})
export class BattleService {
  constructor(
    private store: Store,
  ) {
  }

  private gameEndedSubject$ = new Subject<boolean>();
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
    this.randomGameEnd();
  }

  public onPlayerBeastsMoveStarted(): void {
    console.log('Player Beasts Move Started');
    this.randomGameEnd();
  }

  public onPlayerBeastsMoveCompleted(): void {
    console.log('Player Beasts Move Completed');
    this.randomGameEnd();
  }

  public onCpuMoveStarted(): void {
    console.log('CPU Move Started');
    this.randomGameEnd();
  }

  public onCpuMoveCompleted(): void {
    console.log('CPU Move Completed');
    this.randomGameEnd();
  }

  public onCpuBeastsMoveStarted(): void {
    console.log('CPU Beasts Move Started');
    this.randomGameEnd();
  }

  public onCpuBeastsMoveCompleted(): void {
    console.log('CPU Beasts Move Completed');
    this.randomGameEnd();
  }

  public onTurnCompleted(): void {
    console.log('Turn Completed');
    this.incrementRound();
  }

  public onGameEnded(): void {
    console.log('Game Ended');
  }

  public randomGameEnd(): boolean {
    const ended = Math.random() < 0.05;
    if (ended) {
      this.gameEndedSubject$.next();
      this.store.dispatch(gameEnded());
    }

    return ended;
  }
}
