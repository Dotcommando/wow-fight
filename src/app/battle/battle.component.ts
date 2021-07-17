import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';

import { select, Store } from '@ngrx/store';

import { combineLatest, Observable, Subject } from 'rxjs';
import { filter, map, takeUntil, tap } from 'rxjs/operators';

import { NAMES } from '../constants/name.enum';
import { PHASE } from '../constants/phase.constant';
import { IAttack, IAttackVectors, ICharacterShort } from '../models/attack-vectors.interface';
import { ICastedSpell } from '../models/casted-spell.interface';
import { IBeastCharacter, IMainCharacter, InstanceOf } from '../models/character.type';
import { IPartiesIds } from '../models/parties-ids.interface';
import { ITurnState } from '../models/turn.interface';
import { updatePlayerAttack } from '../store/attacks/attacks.actions';
import { selectAttackVectors } from '../store/attackVectors/attack-vectors.selectors';
import {
  selectCharacters,
  selectCPUBeasts,
  selectCPUCharacter,
  selectParties,
  selectPlayerBeasts,
  selectPlayerCharacter,
} from '../store/fighters/fighters.selectors';
import { selectSpells } from '../store/spells/spells.selectors';
import { selectCurrentFighterId, selectCurrentPhase, selectRoundNumber, selectTurn } from '../store/turn/turn.selectors';


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

  public turn$: Observable<ITurnState> = this.store.pipe(
    select(selectTurn),
  );

  public spells$: Observable<ICastedSpell[]> = this.store.pipe(
    select(selectSpells),
  );

  public partiesIds$: Observable<IPartiesIds> = this.store.pipe(
    select(selectParties),
  );

  public phase$: Observable<PHASE | null> = this.store.pipe(
    select(selectCurrentPhase),
  );

  public roundNumber$: Observable<number> = this.store.pipe(
    select(selectRoundNumber),
  );

  public currentFighterId$: Observable<string> = this.store.pipe(
    select(selectCurrentFighterId),
  );

  public playerCharacter!: InstanceOf<IMainCharacter>;
  public cpuCharacter!: InstanceOf<IMainCharacter>;
  public playerBeasts: InstanceOf<IBeastCharacter>[] = [];
  public cpuBeasts: InstanceOf<IBeastCharacter>[] = [];

  private currentFighter!: ICharacterShort;

  private playerAttack!: IAttack;

  private destroy$ = new Subject<void>();

  public form: FormGroup = new FormGroup({
    playerAttacksControl: new FormControl(),
  });

  public playerAttackVectors$: Observable<IAttackVectors | null> = combineLatest(
    this.store.pipe(select(selectPlayerCharacter)),
    this.store.pipe(select(selectTurn)),
    this.store.pipe(select(selectAttackVectors)),
  )
    .pipe(
      filter(([ player, turn, attackVectors ]) => turn.movingFighter === player.id),
      map(([ player, turn, attackVectors ]) => attackVectors),
    );

  constructor(
    private store: Store,
  ) { }

  ngOnInit(): void {
    this.roundNumber$
      .pipe(
        tap((roundNumber: number) => {
          if (roundNumber > 0) {
            if (roundNumber > 1) {
              console.log(' ');
              console.log(' ');
              console.log(' ');
            }
            console.log('Round number:', roundNumber);
          }
        }),
        takeUntil(this.destroy$),
      )
      .subscribe();

    this.playerCharacter$
      .pipe(
        tap((playerCharacter: InstanceOf<IMainCharacter | IBeastCharacter> | null) => {
          if (playerCharacter) {
            this.playerCharacter = playerCharacter as InstanceOf<IMainCharacter>;
          }
        }),
        takeUntil(this.destroy$),
      )
      .subscribe();

    this.cpuCharacter$
      .pipe(
        tap((cpuCharacter: InstanceOf<IMainCharacter | IBeastCharacter> | null) => {
          if (cpuCharacter) {
            this.cpuCharacter = cpuCharacter as InstanceOf<IMainCharacter>;
          }
        }),
        takeUntil(this.destroy$),
      )
      .subscribe();

    combineLatest(
      this.currentFighterId$,
      this.allFighters$,
    )
      .pipe(
        tap(([ currentFighterId, allFighters ]) => {
          this.currentFighter = {
            id: currentFighterId,
            name: allFighters.find(fighter => fighter.id === currentFighterId)?.name,
          };
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
        updatePlayerAttack({
          attack: {
            ...this.playerAttack,
            assaulter: this.currentFighter,
          },
        }),
      );
    }
  }
}
