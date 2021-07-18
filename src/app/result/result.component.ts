import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { Store } from '@ngrx/store';

import { Subject } from 'rxjs';
import { takeUntil, tap } from 'rxjs/operators';

import { NAMES } from '../constants/name.enum';
import { STATUSES } from '../constants/statuses.enum';
import { resetAttack } from '../store/attacks/attacks.actions';
import { resetAttackVectors } from '../store/attackVectors/attack-vectors.actions';
import { recreateCharacters } from '../store/fighters/fighters.actions';
import { clearSpells } from '../store/spells/spells.actions';
import { resetTurns } from '../store/turn/turn.actions';


@Component({
  selector: 'app-result',
  templateUrl: './result.component.html',
  styleUrls: ['./result.component.scss'],
})
export class ResultComponent implements OnInit, OnDestroy {
  public names = NAMES;

  public playerName!: NAMES;
  public playerId!: string;
  public playerStatus!: STATUSES;
  public cpuName!: NAMES;
  public cpuId!: string;
  public cpuStatus!: STATUSES;
  public winnerId!: string;

  private destroy$ = new Subject<void>();

  constructor(
    private store: Store,
    private router: Router,
    private route: ActivatedRoute,
  ) { }

  ngOnInit(): void {
    this.route.params
      .pipe(
        tap(({
          playerName,
          playerId,
          playerStatus,
          cpuName,
          cpuId,
          cpuStatus,
          winnerId,
        }) => {
          this.playerName = playerName;
          this.playerId = playerId;
          this.playerStatus = playerStatus;
          this.cpuName = cpuName;
          this.cpuId = cpuId;
          this.cpuStatus = cpuStatus;
          this.winnerId = winnerId;
        }),
        takeUntil(this.destroy$),
      )
      .subscribe();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  public navigateToStart(): void {
    this.store.dispatch(resetAttackVectors());
    this.store.dispatch(resetAttack());
    this.store.dispatch(clearSpells());
    this.store.dispatch(resetTurns());
    this.store.dispatch(recreateCharacters());
    this.router.navigate(['start']);
  }
}
