import { Injectable } from '@angular/core';

import { select, Store } from '@ngrx/store';

import { BehaviorSubject, combineLatest, Subject } from 'rxjs';
import { map, tap } from 'rxjs/operators';

import { MOVE_STATUSES } from '../constants/move-statuses.enum';
import { GAME_SETTINGS, PRIORITY_QUERY } from '../constants/settings.constant';
import { ALL_SPELLS } from '../constants/spells.constant';
import { SPELL_TARGET, SPELLS } from '../constants/spells.enum';
import { STATUSES } from '../constants/statuses.enum';
import { IAttackVectorProcessing } from '../models/attack-vector-processing.interface';
import { AttackVector, IAttackVectors } from '../models/attack-vectors.interface';
import { ICastedSpell } from '../models/casted-spell.interface';
import { IBeastCharacter, IMainCharacter, InstanceOf } from '../models/character.type';
import { CombinedFightersParties } from '../models/combined-fighter-parties.type';
import { IAssaulterEnemies } from '../models/player-enemies.interface';
import { ISpellsLoopData } from '../models/spells-loop-data.interface';
import { selectCharacters, selectParties } from '../store/fighters/fighters.selectors';
import { selectSpells } from '../store/spells/spells.selectors';
import { gameEnded } from '../store/turn/turn.actions';
import { selectCurrentFighterId } from '../store/turn/turn.selectors';

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

  private spellsLoopSubject$ = new Subject<ISpellsLoopData>();
  public spellsLoop$ = this.spellsLoopSubject$.asObservable();

  private assaulterId$ = this.store.pipe(
    select(selectCurrentFighterId),
  );

  private fighters$ = this.store.pipe(
    select(selectCharacters),
  );

  private parties$ = this.store.pipe(
    select(selectParties),
  );

  private spells$ = this.store.pipe(
    select(selectSpells),
  );

  private filterAssaulterEnemies = ([ assaulterId, fighters, parties, spells ]: CombinedFightersParties): IAssaulterEnemies => {
    const assaulter = fighters.find(fighter => fighter.id === assaulterId) as InstanceOf<IMainCharacter>;
    const enemyPartyId = assaulter.partyId === parties.cpuPartyId
      ? parties.playerPartyId
      : parties.cpuPartyId;
    const enemies = fighters.filter(fighter => fighter.partyId === enemyPartyId && fighter.isAlive);

    return { assaulter, enemies, spells };
  };

  private filterPlayerAndCpuEnemies = (fightersParties: CombinedFightersParties): IAssaulterEnemies =>
    this.filterAssaulterEnemies(fightersParties);

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
    const { assaulter, enemies, spells } = attackVector.assaulterEnemies;

    if (attackVector.attackVector.skip || assaulter.canNotCast) {
      return attackVector;
    }

    attackVector.attackVector.cast = [];

    const availableAssaulterSpells: SPELLS[] = assaulter.spells ?? [];

    if (!availableAssaulterSpells?.length) {
      return attackVector;
    }

    const spellsCasted: ICastedSpell[] = spells.filter(spell => spell.assaulter === assaulter.id);

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
    this.assaulterId$,
    this.fighters$,
    this.parties$,
    this.spells$,
  ])
    .pipe(
      map(this.filterPlayerAndCpuEnemies),
      map(this.calculateSkip),
      map(this.calculateHit),
      map(this.calculateSpellCasting),
      tap(({ attackVector }) => this.playerAttackVectors = attackVector),
      tap(({ attackVector }) => this.playerAttackVectorsSubject$.next(attackVector)),
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

    return nextFromAnotherParty.reduce(this.findOneFittedFighter, fighters[0]);
  }

  public pushSpellsLoop(spellsLoopData: ISpellsLoopData): void {
    this.spellsLoopSubject$.next(spellsLoopData);
  }
}
