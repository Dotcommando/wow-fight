import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';

import { select, Store } from '@ngrx/store';

import { BehaviorSubject, combineLatest, NEVER, Observable, Subject } from 'rxjs';
import { distinctUntilChanged, filter, map, scan, take, takeUntil, tap } from 'rxjs/operators';

import { NAMES } from '../constants/name.enum';
import { PHASE, PHASES } from '../constants/phase.constant';
import { compareObjects } from '../helpers/compare-arrays-of-any.helper';
import { compareITurnArrays } from '../helpers/compare-iturn-arrays.helper';
import { IAttack, IAttackVectors } from '../models/attack-vectors.interface';
import { ICastedSpell } from '../models/casted-spell.interface';
import { IBeastCharacter, IMainCharacter, InstanceOf } from '../models/character.type';
import { IPartiesIds } from '../models/parties-ids.interface';
import { ITurn } from '../models/turn.interface';
import { BattleService } from '../services/battle.service';
import { moveCompleted } from '../store/fighters/fighters.actions';
import {
  selectCharacters,
  selectCPUBeasts,
  selectCPUCharacter, selectParties,
  selectPlayerBeasts,
  selectPlayerCharacter,
} from '../store/fighters/fighters.selectors';
import { selectSpells } from '../store/spells/spells.selectors';
import { selectCurrentTurn, selectTurns } from '../store/turn/turn.selectors';


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

  public allFighters$: Observable<InstanceOf<IMainCharacter | IBeastCharacter>[]> = this.store.pipe(
    select(selectCharacters),
  );

  public turns$: Observable<ITurn[]> = this.store.pipe(
    select(selectTurns),
  );

  public spells$: Observable<ICastedSpell[]> = this.store.pipe(
    select(selectSpells),
  );

  public currentTurn$: Observable<ITurn> = this.store.pipe(
    select(selectCurrentTurn),
  );

  public partiesIds$: Observable<IPartiesIds> = this.store.pipe(
    select(selectParties),
  );

  public playerCharacter!: InstanceOf<IMainCharacter>;
  public cpuCharacter!: InstanceOf<IMainCharacter>;
  public playerBeasts: InstanceOf<IBeastCharacter>[] = [];
  public cpuBeasts: InstanceOf<IBeastCharacter>[] = [];

  private playerAttack!: IAttack;

  public turnNumber = 1;

  private destroy$ = new Subject<void>();

  public form: FormGroup = new FormGroup({
    playerAttacksControl: new FormControl(),
  });

  public playerAttackVectors$: Observable<IAttackVectors | null> = this.battleService.playerAttackVectors$;

  private newTurnHasStartedSubject$ = new BehaviorSubject<ITurn | null>(null);
  public newTurnHasStarted$ = this.newTurnHasStartedSubject$.asObservable();

  private newPhaseHasStartedSubject$ = new BehaviorSubject<PHASE | null>(null);
  public newPhaseHasStarted$ = this.newPhaseHasStartedSubject$.asObservable();

  private currentFighterIdSubject$ = new BehaviorSubject<string | null>(null);
  public currentFighterId$ = this.currentFighterIdSubject$.asObservable();

  private firstTurn = true;

  constructor(
    private store: Store,
    private battleService: BattleService,
  ) { }

  ngOnInit(): void {
    this.newTurnHasStarted$
      .pipe(
        filter((turn: ITurn | null) => Boolean(turn)),
        tap((turn: ITurn | null) => this.currentFighterIdSubject$.next(turn?.movingFighter as string)),
        tap((newTurn: ITurn | null) => console.log('New turn:', newTurn)),
        takeUntil(this.destroy$),
      )
      .subscribe();

    combineLatest([
      this.currentTurn$,
      this.newPhaseHasStarted$,
      this.spells$,
      this.currentFighterId$,
      this.allFighters$,
      this.partiesIds$,
    ])
      .pipe(
        filter(([ turn, phase, spells, assaulterId, fighters, partiesIds ]) => !!assaulterId && [ null, PHASE.BEFORE_MOVE, PHASE.AFTER_MOVE ].includes(phase)),
        // @ts-ignore
        distinctUntilChanged(compareObjects),
        // map((dataArray: Iterable<{ 0: ITurn; 1: PHASE; 2: ICastedSpell[]; 3: string; 4: InstanceOf<IMainCharacter | IBeastCharacter>; 5: { cpuPartyId: string; playerPartyId: string } }>) => {
        map((dataArray) => {

          // @ts-ignore
          const [ turn, phase, spells, assaulterId, fighters, partiesIds ] = dataArray;
          if (phase === PHASE.MOVING && assaulterId === partiesIds.playerPartyId) {
            return NEVER;
          }

          if (!spells.length && phase && [ PHASE.BEFORE_MOVE, PHASE.AFTER_MOVE ].includes(phase)) {
            // @ts-ignore
            this.battleService.switchToNextStep({ turn, phase, spells, assaulterId, fighters, partiesIds });
          }

          return dataArray;
        }),
        take(6),
        takeUntil(this.destroy$),
      )
      .subscribe();

    this.turns$
      .pipe(
        tap((turns: ITurn[]) => {
          if (this.firstTurn) {
            this.firstTurn = false;
            this.newTurnHasStartedSubject$.next(turns[turns.length - 1]);
            this.newPhaseHasStartedSubject$.next(turns[turns.length - 1].phase);
            this.currentFighterIdSubject$.next(turns[turns.length - 1].movingFighter);
          }
        }),
        distinctUntilChanged(compareITurnArrays),
        scan((prevTurns: ITurn[], currentTurns: ITurn[]) => {
          console.log(' ');
          console.log('====================');
          console.log('prev', prevTurns);
          console.log('next', currentTurns);

          if (prevTurns.length < currentTurns.length) {
            this.newTurnHasStartedSubject$.next(currentTurns[currentTurns.length - 1]);
            this.newPhaseHasStartedSubject$.next(currentTurns[currentTurns.length - 1].phase);
            this.currentFighterIdSubject$.next(currentTurns[currentTurns.length - 1].movingFighter);
          }

          if (prevTurns[prevTurns.length - 1].phase !== currentTurns[currentTurns.length - 1].phase) {
            this.newPhaseHasStartedSubject$.next(currentTurns[currentTurns.length - 1].phase);
          }

          if (prevTurns[prevTurns.length - 1].movingFighter !== currentTurns[currentTurns.length - 1].movingFighter) {
            this.currentFighterIdSubject$.next(currentTurns[currentTurns.length - 1].movingFighter);
          }

          return currentTurns;
        }),
        takeUntil(this.destroy$),
      )
      .subscribe();

    // @ts-ignore
    this.form
      .get('playerAttacksControl')
      .valueChanges
      .pipe(
        tap((playerAttack: IAttack) => this.playerAttack = playerAttack),
      )
      .subscribe();

  }

  ngOnDestroy(): void {
    this.destroy$.next();
  }

  public turnRound(): void {
    if (this.playerAttack) {
      this.store.dispatch(
        moveCompleted({
          attack: this.playerAttack,
          assaulter: this.playerCharacter,
        }),
      );
    }
  }
}
