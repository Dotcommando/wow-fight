import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';

import { select, Store } from '@ngrx/store';

import { Observable, Subject } from 'rxjs';
import { takeUntil, tap } from 'rxjs/operators';

import { NAMES } from '../constants/name.enum';
import { PHASE } from '../constants/phase.constant';
import { IAttack, IAttackVectors, ICharacterShort } from '../models/attack-vectors.interface';
import { ICastedSpell } from '../models/casted-spell.interface';
import { IBeastCharacter, IMainCharacter, InstanceOf } from '../models/character.type';
import { IPartiesIds } from '../models/parties-ids.interface';
import { ITurnState } from '../models/turn.interface';
import { BattleService } from '../services/battle.service';
import { updateAttack } from '../store/attacks/attacks.actions';
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

  private playerAttack!: IAttack;

  public turnNumber = 1;

  private destroy$ = new Subject<void>();

  public form: FormGroup = new FormGroup({
    playerAttacksControl: new FormControl(),
  });

  public playerAttackVectors$: Observable<IAttackVectors | null> = this.battleService.playerAttackVectors$;

  constructor(
    private store: Store,
    private battleService: BattleService,
  ) { }

  ngOnInit(): void {
    this.roundNumber$
      .pipe(
        tap((roundNumber: number) => console.log('Round number:', roundNumber)),
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
        updateAttack({
          attack: {
            ...this.playerAttack,
            assaulter: {
              id: this.playerCharacter.id,
              name: this.playerCharacter.name,
            } as ICharacterShort,
          },
        }),
      );
    }
  }
}
