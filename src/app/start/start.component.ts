import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';

import { select, Store } from '@ngrx/store';

import { Subject } from 'rxjs';
import { takeUntil, tap } from 'rxjs/operators';

import { NAMES } from '../constants/name.enum';
import { IBeastCharacter, IMainCharacter, InstanceOf } from '../models/character.type';
import { toggleCharacters } from '../store/fighters/fighters.actions';
import { selectParties, selectPlayerCharacter } from '../store/fighters/fighters.selectors';
import { gameStarted } from '../store/turn/turn.actions';


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

  public parties$ = this.store.pipe(
    select(selectParties),
  );

  public playerCharacterName: NAMES | undefined;

  private playerPartyId!: string;
  private playerId!: string;

  private destroy$ = new Subject<void>();

  constructor(
    private store: Store,
    private router: Router,
  ) { }

  ngOnInit(): void {
    this.parties$
      .pipe(
        tap(({ playerPartyId }: { playerPartyId: string }) => this.playerPartyId = playerPartyId),
        takeUntil(this.destroy$),
      )
      .subscribe();

    this.playerCharacter$
      .pipe(
        tap((player: InstanceOf<IMainCharacter | IBeastCharacter> | null) => {
          if (player) this.playerId = player.id;
        }),
        takeUntil(this.destroy$),
      )
      .subscribe();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  public updatePlayerCharacter(name: NAMES): void {
    if (name !== this.playerCharacterName) {
      this.store.dispatch(toggleCharacters());
    }
    this.playerCharacterName = name;
  }

  public navigateToBattle(): void {
    this.router.navigate(['battle']);
    this.store.dispatch(gameStarted({ playerId: this.playerId, playerPartyId: this.playerPartyId }));
  }
}
