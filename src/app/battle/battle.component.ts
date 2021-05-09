import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';

import { select, Store } from '@ngrx/store';

import { Observable, Subject } from 'rxjs';
import { filter, map, takeUntil, tap } from 'rxjs/operators';

import { NAMES } from '../constants/name.enum';
import { IBeastCharacter, IMainCharacter, InstanceOf } from '../models/character.type';
import {
  selectCPUBeasts,
  selectCPUCharacter,
  selectPlayerBeasts,
  selectPlayerCharacter,
} from '../store/fighters/fighters.selectors';


@Component({
  selector: 'app-battle',
  templateUrl: './battle.component.html',
  styleUrls: ['./battle.component.scss'],
})
export class BattleComponent implements OnInit, OnDestroy {

  public names = NAMES;

  public playerCharacter$: Observable<InstanceOf<IMainCharacter | IBeastCharacter> | null> = this.store.pipe(
    select(selectPlayerCharacter),
  );

  public cpuCharacter$: Observable<InstanceOf<IMainCharacter | IBeastCharacter> | null> = this.store.pipe(
    select(selectCPUCharacter),
  );

  public playerBeasts$: Observable<InstanceOf<IMainCharacter | IBeastCharacter>[]> = this.store.pipe(
    select(selectPlayerBeasts),
  );

  public cpuBeasts$: Observable<InstanceOf<IMainCharacter | IBeastCharacter>[]> = this.store.pipe(
    select(selectCPUBeasts),
  );

  public playerCharacter!: InstanceOf<IMainCharacter>;
  public cpuCharacter!: InstanceOf<IMainCharacter>;
  public playerBeasts: InstanceOf<IBeastCharacter>[] = [];
  public cpuBeasts: InstanceOf<IBeastCharacter>[] = [];

  public turnNumber = 1;

  private destroy$ = new Subject<void>();

  public form: FormGroup = new FormGroup({
    playerAttacksControl: new FormControl(),
  });

  constructor(
    private store: Store,
  ) { }

  // eslint-disable-next-line @angular-eslint/no-empty-lifecycle-method
  ngOnInit(): void {
    this.playerCharacter$
      .pipe(
        filter((character: InstanceOf<IMainCharacter | IBeastCharacter> | null) => !!character),
        tap((character: InstanceOf<IMainCharacter | IBeastCharacter> | null) => {
          if (character) {
            this.playerCharacter = character as InstanceOf<IMainCharacter>;
          }
        }),
        takeUntil(this.destroy$),
      )
      .subscribe();

    this.cpuCharacter$
      .pipe(
        filter((character: InstanceOf<IMainCharacter | IBeastCharacter> | null) => !!character),
        tap((character: InstanceOf<IMainCharacter | IBeastCharacter> | null) => {
          if (character) {
            this.cpuCharacter = character as InstanceOf<IMainCharacter>;
          }
        }),
        takeUntil(this.destroy$),
      )
      .subscribe();

    this.playerBeasts$
      .pipe(
        tap((characters: InstanceOf<IMainCharacter | IBeastCharacter>[]) => {
          this.playerBeasts = characters as InstanceOf<IBeastCharacter>[]  ?? [];
        }),
        takeUntil(this.destroy$),
      )
      .subscribe();

    this.cpuBeasts$
      .pipe(
        tap((characters: InstanceOf<IMainCharacter | IBeastCharacter>[]) => {
          this.cpuBeasts = characters as InstanceOf<IBeastCharacter>[] ?? [];
        }),
        takeUntil(this.destroy$),
      )
      .subscribe();
    // this.attackService
    //   .theoryChecking$
    //   .pipe(
    //     takeUntil(this.destroy$),
    //   )
    //   .subscribe();
    //
    // this.form
    //   .get('playerAttacksControl')
    //   .valueChanges
    //   .pipe(
    //     map(({ value }) => {
    //       console.log('value', value);
    //       this.playerAttack = value;
    //       this.attackService.setPlayerAttack(value);
    //       return value;
    //     }),
    //     takeUntil(this.destroy$),
    //   )
    //   .subscribe();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
  }

  // public turnRound(): void {
  //   this.store.dispatch(playerMoveStarted());
  // }
}
