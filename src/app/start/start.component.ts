import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';

import { select, Store } from '@ngrx/store';

import { Subject } from 'rxjs';
import { takeUntil, tap } from 'rxjs/operators';

import { NAMES } from '../constants/name.enum';
import { BattleService } from '../services/battle.service';
import { gameStarted } from '../store/battle/battle.actions';
import { toggleCharacters } from '../store/fighters/fighters.actions';
import { selectPlayerCharacter } from '../store/fighters/fighters.selectors';


@Component({
  selector: 'app-start',
  templateUrl: './start.component.html',
  styleUrls: ['./start.component.scss'],
})
export class StartComponent implements OnInit, OnDestroy {

  public form: FormGroup = new FormGroup({
    roundDuration: new FormControl(),
  });

  public names = NAMES;

  public playerCharacter$ = this.store.pipe(
    select(selectPlayerCharacter),
  );

  public playerCharacterName: NAMES | undefined;

  private destroy$ = new Subject<void>();

  constructor(
    private store: Store,
    private router: Router,
    private battleService: BattleService,
  ) { }

  ngOnInit(): void {
    this.playerCharacter$
      .pipe(
        tap(char => console.log('player', char)),
        takeUntil(this.destroy$),
      )
      .subscribe();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
  }

  public updatePlayerCharacter(name: NAMES): void {
    if (name !== this.playerCharacterName) {
      this.store.dispatch(toggleCharacters());
    }
    this.playerCharacterName = name;
  }

  public navigateToBattle(): void {
    this.router.navigate(['battle']);
    this.store.dispatch(gameStarted());
  }
}
