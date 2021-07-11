import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';

import { select, Store } from '@ngrx/store';

import { BehaviorSubject, combineLatest, NEVER, Observable, Subject } from 'rxjs';
import { distinctUntilChanged, filter, map, scan, take, takeUntil, tap } from 'rxjs/operators';

import { NAMES } from '../constants/name.enum';
import { PHASE } from '../constants/phase.constant';
import { STATUSES } from '../constants/statuses.enum';
import { compareObjects } from '../helpers/compare-arrays-of-any.helper';
import { IAttack, IAttackVectors, ICharacterShort } from '../models/attack-vectors.interface';
import { ICastedSpell, STAGE, STAGE_OF } from '../models/casted-spell.interface';
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
import { addSpell, executeHit } from '../store/spells/spells.actions';
import { selectSpells } from '../store/spells/spells.selectors';
import { selectCurrentPhase, selectRoundNumber, selectTurn } from '../store/turn/turn.selectors';
import { applySpellToCharacter } from '../store/fighters/fighters.actions';


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

  private currentFighterIdSubject$ = new BehaviorSubject<string | null>(null);
  public currentFighterId$ = this.currentFighterIdSubject$.asObservable();

  private firstTurn = true;

  constructor(
    private store: Store,
    private battleService: BattleService,
  ) { }

  ngOnInit(): void {
    this.roundNumber$
      .pipe(
        // tap((turn: ITurn | null) => this.currentFighterIdSubject$.next(turn?.movingFighter as string)),
        tap((roundNumber: number) => console.log('Round number:', roundNumber)),
        takeUntil(this.destroy$),
      )
      .subscribe();

    combineLatest([
      this.turn$,
      this.phase$,
      this.spells$,
      this.currentFighterId$,
      this.allFighters$,
      this.partiesIds$,
    ])
      .pipe(
        // filter(([ turn, phase, spells, assaulterId, fighters, partiesIds ]) => !!assaulterId && [ null, PHASE.BEFORE_MOVE, PHASE.AFTER_MOVE ].includes(phase)),
        // @ts-ignore
        distinctUntilChanged(compareObjects),
        map((dataArray) => {
          // @ts-ignore
          const [ turn, phase, spells, assaulterId, fighters, partiesIds ] = dataArray;
          const currentFighter = fighters.find(fighter => fighter.id === assaulterId);
          console.log(currentFighter?.status);
          console.log(phase);
          if (phase === PHASE.MOVING && currentFighter?.status === STATUSES.PLAYER) {
            console.log('It\'s player move!');
            return NEVER;
          } else if (phase === PHASE.MOVING && currentFighter?.status === STATUSES.CPU) {
            console.log('It\'s CPU move!');
          }

          if (!spells.length && phase && [ PHASE.BEFORE_MOVE, PHASE.AFTER_MOVE ].includes(phase)) {
            // @ts-ignore
            // this.battleService.switchToNextStep({ turn, phase, spells, assaulterId, fighters, partiesIds });
          }

          return dataArray;
        }),
        take(6),
        takeUntil(this.destroy$),
      )
      .subscribe();

    this.battleService.spellsLoop$
      .pipe(
        tap((data) => console.log('spellsLoopData', data)),
        tap(({ characters, parties, spells, currentTurn, attack }) => {
          if (attack.spell) {
            return this.store.dispatch(addSpell({ attack }));
          }

          let spellsToExec: ICastedSpell[];

          if (currentTurn.phase === PHASE.BEFORE_MOVE) {
            spellsToExec = spells.filter(spell =>
              // If casted by assaulter
              (!spell.firedInThisTurn
              && (spell.fireOnStage === STAGE.BEFORE_MOVE && spell.stageOf === STAGE_OF.ASSAULTER)
              && spell.assaulter === currentTurn.movingFighter)
              || (
                // if moving fighter is target
                !spell.firedInThisTurn
                && (spell.fireOnStage === STAGE.BEFORE_MOVE && spell.stageOf === STAGE_OF.TARGET)
                && spell.target === currentTurn.movingFighter));
          } else if (currentTurn.phase === PHASE.AFTER_MOVE) {
            spellsToExec = spells.filter(spell =>
              // If casted by assaulter
              (!spell.firedInThisTurn
                && (spell.fireOnStage === STAGE.AFTER_MOVE && spell.stageOf === STAGE_OF.ASSAULTER)
                && spell.assaulter === currentTurn.movingFighter)
              || (
                // if moving fighter is target
                !spell.firedInThisTurn
              && (spell.fireOnStage === STAGE.AFTER_MOVE && spell.stageOf === STAGE_OF.TARGET)
              && spell.target === currentTurn.movingFighter));
          }

          if (!spellsToExec || !spellsToExec.length) {
            return this.store.dispatch(executeHit());
          }

          console.log('spellsToExec', spellsToExec);
          return this.store.dispatch(applySpellToCharacter({ fighterId: spellsToExec[0].target, spell: spellsToExec[0] }));
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
