import { Injectable } from '@angular/core';

import { select, Store } from '@ngrx/store';

import { BehaviorSubject, combineLatest, Subject } from 'rxjs';
import { map } from 'rxjs/operators';

import { ALL_SPELLS } from '../constants/spells.constant';
import { SPELL_TARGET, SPELLS } from '../constants/spells.enum';
import { STATUSES } from '../constants/statuses.enum';
import { IAttackVectorProcessing } from '../models/attack-vector-processing.interface';
import { ICastedSpell } from '../models/casted-spell.interface';
import { IMainCharacter, InstanceOf } from '../models/character.type';
import { CombinedFightersParties } from '../models/combined-fighter-parties.type';
import { IAssaulterEnemies } from '../models/player-enemies.interface';
import { gameEnded } from '../store/battle/battle.actions';
import { selectCharacters, selectParties } from '../store/fighters/fighters.selectors';

@Injectable({
  providedIn: 'root',
})
export class BattleService {
  constructor(
    private store: Store,
  ) {
    this.filterPlayerAndCpuEnemies = this.filterPlayerAndCpuEnemies.bind(this);
  }

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
      attackVector.attackVector.hit.push({ id: enemy.id, name: enemy.name });
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
        });
      } else if (spellProto.reduceHP) {
        for (const enemy of enemies) {
          attackVector.attackVector.cast.push({
            target: { id: enemy.id, name: enemy.name },
            spell: {
              name: spellProto.name,
              party: SPELL_TARGET.ENEMY,
            },
          });
        }
      } else if (spellProto.addHP) {
        attackVector.attackVector.cast.push({
          target: { id: assaulter.id, name: assaulter.name },
          spell: {
            name: spellProto.name,
            party: SPELL_TARGET.SELF,
          },
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
    );

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
