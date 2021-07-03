import { Injectable } from '@angular/core';

import { select, Store } from '@ngrx/store';

import { BehaviorSubject, combineLatest, Subject } from 'rxjs';
import { map, switchMap, tap } from 'rxjs/operators';

import { MOVE_STATUSES } from '../constants/move-statuses.enum';
import { PHASE } from '../constants/phase.constant';
import { GAME_SETTINGS, PRIORITY_QUERY } from '../constants/settings.constant';
import { ALL_SPELLS } from '../constants/spells.constant';
import { SPELL_TARGET, SPELLS } from '../constants/spells.enum';
import { STATUSES } from '../constants/statuses.enum';
import { IAttackVectorProcessing } from '../models/attack-vector-processing.interface';
import { Attack, AttackVector, IAttackVectors, IHitAttack } from '../models/attack-vectors.interface';
import { ICastedSpell } from '../models/casted-spell.interface';
import { IBeastCharacter, IMainCharacter, InstanceOf } from '../models/character.type';
import { CombinedFightersParties } from '../models/combined-fighter-parties.type';
import { IMainLoopData } from '../models/main-loop-data.interface';
import { IAssaulterEnemies } from '../models/player-enemies.interface';
import { updateCharacter } from '../store/fighters/fighters.actions';
import { selectCharacters, selectParties } from '../store/fighters/fighters.selectors';
import { gameEnded, turnChangeNextFighter, turnCompleted, turnPhaseChanging } from '../store/turn/turn.actions';

@Injectable({
  providedIn: 'root',
})
export class BattleService {
  constructor(
    private store: Store,
  ) {
    this.filterPlayerAndCpuEnemies = this.filterPlayerAndCpuEnemies.bind(this);
  }

  private playerAttackVectors: IAttackVectors | null = null;

  private playerAttack: AttackVector | null = null;

  private playerAttackSubject$ = new BehaviorSubject<AttackVector | null>(null);
  public playerAttack$ = this.playerAttackSubject$.asObservable();

  private playerAttackVectorsSubject$ = new BehaviorSubject<IAttackVectors | null>(null); // BehaviorSubject or it will not working
  public playerAttackVectors$ = this.playerAttackVectorsSubject$.asObservable();

  private gameEndedSubject$ = new Subject<boolean>();
  public gameEnded$ = this.gameEndedSubject$.asObservable();

  private playerMoveCompletedSubject$ = new Subject<void>();
  public playerMoveCompleted$ = this.playerMoveCompletedSubject$.asObservable();

  private currentRoundSubject$ = new BehaviorSubject<number>(1);
  public currentRound$ = this.currentRoundSubject$.asObservable();

  private fighters$ = this.store.pipe(
    select(selectCharacters),
  );

  private parties$ = this.store.pipe(
    select(selectParties),
  )

  private filterAssaulterEnemies = (status: STATUSES, [ fighters, parties ]: CombinedFightersParties): IAssaulterEnemies => {
    const assaulter = fighters.find(fighter => fighter.status === status) as InstanceOf<IMainCharacter>;
    const enemyPartyId = assaulter.partyId === parties.cpuPartyId
      ? parties.playerPartyId
      : parties.cpuPartyId;
    const enemies = fighters.filter(fighter => fighter.partyId === enemyPartyId && fighter.isAlive);

    return { assaulter, enemies };
  };

  private filterPlayerAndCpuEnemies = (fightersParties: CombinedFightersParties): IAssaulterEnemies =>
    this.filterAssaulterEnemies(STATUSES.PLAYER, fightersParties);

  private calculateSkip = (assaulterEnemies: IAssaulterEnemies): IAttackVectorProcessing => ({
    assaulterEnemies,
    attackVector: {
      skip: assaulterEnemies.assaulter.canNotAttack && assaulterEnemies.assaulter.canNotCast,
    },
  } as IAttackVectorProcessing);

  private calculateHit = (attackVector: IAttackVectorProcessing): IAttackVectorProcessing => {
    const { assaulter, enemies } = attackVector.assaulterEnemies;

    if (attackVector.attackVector.skip || assaulter.canNotAttack) {
      return attackVector;
    }

    attackVector.attackVector.hit = [];

    for (const enemy of enemies) {
      attackVector.attackVector.hit.push({
        target: { id: enemy.id, name: enemy.name },
        hit: true,
        spell: null,
      });
    }

    return attackVector;
  }

  private calculateSpellCasting = (attackVector: IAttackVectorProcessing): IAttackVectorProcessing => {
    const { assaulter, enemies } = attackVector.assaulterEnemies;

    if (attackVector.attackVector.skip || assaulter.canNotCast) {
      return attackVector;
    }

    attackVector.attackVector.cast = [];

    const availableAssaulterSpells: SPELLS[] = assaulter.spells ?? [];

    if (!availableAssaulterSpells?.length) {
      return attackVector;
    }

    const spellsCasted: ICastedSpell[] = assaulter.spellsCasted;

    for (const spell of availableAssaulterSpells) {
      if (spellsCasted?.some(spellCasted => spellCasted.spellName === spell)) {
        continue;
      }

      const spellProto = ALL_SPELLS.find(spellItem => spellItem.name === spell);

      if (!spellProto) {
        continue;
      }

      if (spellProto.calledBeast) {
        attackVector.attackVector.cast.push({
          spell: {
            name: spellProto.name,
            party: SPELL_TARGET.CALL,
            nameOfBeast: spellProto.calledBeast,
          },
          hit: false,
        });
      } else if (spellProto.canNotCast || spellProto.canNotAttack || spellProto.reduceHP) {
        for (const enemy of enemies) {
          attackVector.attackVector.cast.push({
            target: { id: enemy.id, name: enemy.name },
            spell: {
              name: spellProto.name,
              party: SPELL_TARGET.ENEMY,
            },
            hit: false,
          });
        }
      } else if (spellProto.addHP) {
        attackVector.attackVector.cast.push({
          target: { id: assaulter.id, name: assaulter.name },
          spell: {
            name: spellProto.name,
            party: SPELL_TARGET.SELF,
          },
          hit: false,
        });
      }
    }

    return attackVector;
  }

  public calculateAttackVectors$ = combineLatest([
    this.fighters$,
    this.parties$,
  ])
    .pipe(
      map(this.filterPlayerAndCpuEnemies),
      map(this.calculateSkip),
      map(this.calculateHit),
      map(this.calculateSpellCasting),
      tap(({ attackVector }) => console.log(attackVector)),
      // tap(({ attackVector }) => this.playerAttackVectors = attackVector),
      tap(({ attackVector }) => this.playerAttackVectorsSubject$.next(attackVector)),
    );

  public emitPlayerMoveCompleted(): void {
    this.playerMoveCompletedSubject$.next();
  }

  applyHit = (attack: Attack, assaulter: InstanceOf<IMainCharacter>) => ([ fighters, parties ] : CombinedFightersParties) => {
    if (!(attack as IHitAttack)?.hit) {
      return [ fighters, parties ];
    }

    const damage = Math.random() > assaulter.crit
      ? assaulter.dps * 1.5
      : assaulter.dps;

    const defender = fighters.find(fighter => fighter.id === attack?.target?.id);

    if (defender) {
      console.log('defender', defender);
      this.store.dispatch(
        updateCharacter({
          character: { ...defender, hp: defender.hp - damage },
        }),
      );
    }

    console.log(assaulter);
    return [ fighters, parties ];
  }

  public applyPlayerAttack = (playerAttack: Attack, assaulter: InstanceOf<IMainCharacter>) => this.playerAttack$
    .pipe(
      switchMap(() => combineLatest([
        this.fighters$,
        this.parties$,
      ])
        .pipe(
          tap(_ => console.log('playerAttack', playerAttack)),
          map((this.applyHit(playerAttack, assaulter))),
          map(() => console.log(playerAttack)),
        )),
    );

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
    const ended = Math.random() < 0.01;
    if (ended) {
      this.gameEndedSubject$.next();
      this.store.dispatch(gameEnded());
    }

    return ended;
  }

  public setPlayerAttack(newPlayerAttack: AttackVector): void {
    this.playerAttack = newPlayerAttack;
    this.playerAttackSubject$.next(newPlayerAttack);
  }

  private findOneFittedFighter = (fighter: InstanceOf<IMainCharacter | IBeastCharacter> | undefined, next: InstanceOf<IMainCharacter | IBeastCharacter>) => {
    if (!fighter) return next;
    if (GAME_SETTINGS.priority === PRIORITY_QUERY.LOWEST_FIRST) {
      return fighter.priority < next.priority
        ? fighter
        : next;
    } else {
      return fighter.priority > next.priority
        ? fighter
        : next;
    }
  };

  public calculateNextFighter(currentFighterId: string, fighters: InstanceOf<IMainCharacter | IBeastCharacter>[]): InstanceOf<IMainCharacter | IBeastCharacter> {
    const currentCharacter: InstanceOf<IMainCharacter | IBeastCharacter> | undefined = fighters.find(fighter => fighter.id === currentFighterId);

    if (!currentCharacter) {
      throw new Error('Cannot find current fighter in fighters array of the store.');
    }

    const currentParty = currentCharacter.partyId;
    const nextOfThisParty = fighters.filter(fighter => fighter.partyId === currentParty && fighter.move === MOVE_STATUSES.NOT_MOVED);

    if (nextOfThisParty.length) {
      return nextOfThisParty.reduce(this.findOneFittedFighter);
    }

    const nextFromAnotherParty = fighters.filter(fighter => fighter.partyId !== currentParty && fighter.move === MOVE_STATUSES.NOT_MOVED);

    return nextFromAnotherParty.reduce(this.findOneFittedFighter);
  }

  public switchToNextStep(stepData: IMainLoopData): void {
    if (!stepData.phase) {
      return;
    }

    const { turn, phase, spells, assaulterId, fighters, partiesIds  } = stepData;

    // Смена хода происходит внутри хода одного бойца.
    if ([ PHASE.BEFORE_MOVE, PHASE.MOVING ].includes(phase)) {
      return phase === PHASE.BEFORE_MOVE
        ? this.store.dispatch(turnPhaseChanging({ phase: PHASE.MOVING }))
        : this.store.dispatch(turnPhaseChanging({ phase: PHASE.AFTER_MOVE }));
    }

    // Все бойцы сходили, смена хода.
    if (fighters.every(fighter => fighter.move === MOVE_STATUSES.MOVED)) {
      this.store.dispatch(turnCompleted()); // ====> effect turnCompleted ===> effect turnChangeNextFighter ===> effect nextFighter
    }

    // Смена бойца, то есть смена фазы PHASE.AFTER_MOVE одного бойца на PHASE.BEFORE_MOVE другого бойца внутри хода
    const nextFighterInstance = this.calculateNextFighter(assaulterId, fighters);
    this.store.dispatch(turnChangeNextFighter({ nextFighter: nextFighterInstance.id, nextPartyId: nextFighterInstance.partyId }));
  }
}
