import { Injectable } from '@angular/core';

import { Actions, createEffect, CreateEffectMetadata, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';

import { map, switchMap, tap, withLatestFrom } from 'rxjs/operators';

import { DEFAULT_TURN } from '../../constants/default-turn.constant';
import { STATUSES } from '../../constants/statuses.enum';
import { findNextFighter } from '../../helpers/find-next-fighter.helper';
import { IAttackVectorProcessing } from '../../models/attack-vector-processing.interface';
import { STAGE } from '../../models/casted-spell.interface';
import { IBeastCharacter, IMainCharacter, InstanceOf } from '../../models/character.type';
import { BattleService } from '../../services/battle.service';
import { selectAttack } from '../attacks/attacks.selectors';
import { resetAttackVectors, setAttackVectors } from '../attackVectors/attack-vectors.actions';
import {
  applyHit,
  clearDeadBeasts,
  moveCompleted,
  moveStarted,
  resetMoveStatus,
  restoreFighterAfterSpell,
} from '../fighters/fighters.actions';
import { selectCharacters, selectParties } from '../fighters/fighters.selectors';
import {
  executeHit,
  executeSpellsAfterMove,
  executeSpellsBeforeMove,
  reduceSpellExpiration,
  resetFiredStatus,
} from '../spells/spells.actions';
import { selectSpells } from '../spells/spells.selectors';
import {
  calculateAttackVector,
  gameEnded,
  gameStarted,
  phaseAfterMove,
  phaseBeforeMove,
  setWinner,
  turnChangeNextFighter,
  turnCompleted,
  turnStarted,
} from './turn.actions';
import { selectCurrentFighterId, selectRoundNumber, selectTurn, selectWinnerId } from './turn.selectors';


@Injectable()
export class TurnEffects {
  public gameStarted$ = this.gameStartedFn$();
  public turnStarted$ = this.turnStartedFn$();
  public moveStarted$ = this.moveStartedFn$();
  public phaseBeforeMove$ = this.phaseBeforeMoveFn$();
  public executeSpellsBeforeMove$ = this.executeSpellsBeforeMoveFn$();
  public calculateAttackVector$ = this.calculateAttackVectorFn$();
  public phaseAfterMove$ = this.phaseAfterMoveFn$();
  public executeSpellsAfterMove$ = this.executeSpellsAfterMoveFn$();
  public turnChangeNextFighter$ = this.turnChangeNextFighterFn$();
  public turnCompleted$ = this.turnCompletedFn$();
  public gameEnded$ = this.gameEndedFn$();
  public resetMoveStatus$ = this.resetMoveStatusFn$();
  public clearDeadBeasts$ = this.clearDeadBeastsFn$();
  public applyHit$ = this.applyHitFn$();
  public reduceSpellExpiration$ = this.reduceSpellExpirationFn$();
  public setWinner$ = this.setWinnerFn$();

  constructor(
    private actions$: Actions,
    private store: Store,
    private battleService: BattleService,
  ) {
  }

  private gameStartedFn$(): CreateEffectMetadata {
    return createEffect(() => this.actions$.pipe(
      ofType(gameStarted),
      withLatestFrom(
        this.store.select(selectCharacters),
        this.store.select(selectParties),
        this.store.select(selectRoundNumber),
      ),
      map(([ action, fighters, parties, roundNumber ]) => {
        const nextPartyFighter: InstanceOf<IMainCharacter | IBeastCharacter> = findNextFighter(fighters, parties);

        if (!nextPartyFighter) throw new Error('Cannot choose fighter in \'gameStarted\' effect.');

        return turnStarted({
          turn: {
            ...DEFAULT_TURN,
            roundNumber: roundNumber,
            activeParty: nextPartyFighter.partyId,
            movingFighter: nextPartyFighter.id,
          },
        });
      }),
    ));
  }

  private turnStartedFn$(): CreateEffectMetadata {
    return createEffect(() => this.actions$.pipe(
      ofType(turnStarted),
      tap(() => this.battleService.onTurnStarted()),
      withLatestFrom(
        this.store.select(selectCharacters),
        this.store.select(selectParties),
      ),
      map(([ action, fighters, parties ]) => {
        const nextPartyFighter: InstanceOf<IMainCharacter | IBeastCharacter> = findNextFighter(fighters, parties);

        if (!nextPartyFighter) throw new Error('Cannot choose fighter in \'turnStarted\' effect.');

        return turnChangeNextFighter({ nextFighterId: nextPartyFighter.id, nextPartyId: nextPartyFighter.partyId });
      }),
    ));
  }

  private turnChangeNextFighterFn$(): CreateEffectMetadata {
    return createEffect(() => this.actions$.pipe(
      ofType(turnChangeNextFighter),
      map(() => moveStarted()),
    ));
  }

  private moveStartedFn$(): CreateEffectMetadata {
    return createEffect(() => this.actions$.pipe(
      ofType(moveStarted),
      map(() => phaseBeforeMove()),
    ));
  }

  private phaseBeforeMoveFn$(): CreateEffectMetadata {
    return createEffect(() => this.actions$.pipe(
      ofType(phaseBeforeMove),
      withLatestFrom(
        this.store.select(selectTurn),
        this.store.select(selectCharacters),
      ),
      tap(([ action, turn, fighters ]) => {
        console.log(' ');
        console.log('Ходит:');
        console.log(`${fighters.find(fighter => fighter.id === turn.movingFighter).name } ${fighters.find(fighter => fighter.id === turn.movingFighter).status}`);
        console.log(`${fighters.find(fighter => fighter.id === turn.movingFighter).id }`);
      }),
      map(() => executeSpellsBeforeMove()),
    ));
  }

  private executeSpellsBeforeMoveFn$(): CreateEffectMetadata {
    return createEffect(() => this.actions$.pipe(
      ofType(executeSpellsBeforeMove),
      withLatestFrom(
        this.store.select(selectSpells),
        this.store.select(selectTurn),
        this.store.select(selectAttack),
      ),
      map(this.battleService.executionSpells(STAGE.BEFORE_MOVE, calculateAttackVector)),
    ));
  }

  private calculateAttackVectorFn$() : CreateEffectMetadata {
    return createEffect(() => this.actions$.pipe(
      ofType(calculateAttackVector),
      withLatestFrom(
        this.store.select(selectCurrentFighterId),
        this.store.select(selectCharacters),
        this.store.select(selectParties),
        this.store.select(selectSpells),
      ),
      map(this.battleService.filterActiveFighterAndEnemies),
      map(this.battleService.calculateSkip),
      map(this.battleService.calculateHit),
      map(this.battleService.calculateSpellCasting),
      map((attack: IAttackVectorProcessing) => setAttackVectors({ vectors: attack.attackVector })),
    ));
  }

  private phaseAfterMoveFn$(): CreateEffectMetadata {
    return createEffect(() => this.actions$.pipe(
      ofType(phaseAfterMove),
      map(() => executeSpellsAfterMove()),
    ));
  }

  private executeSpellsAfterMoveFn$(): CreateEffectMetadata {
    return createEffect(() => this.actions$.pipe(
      ofType(executeSpellsAfterMove),
      withLatestFrom(
        this.store.select(selectSpells),
        this.store.select(selectTurn),
        this.store.select(selectAttack),
      ),
      map(this.battleService.executionSpells(STAGE.AFTER_MOVE, executeHit)),
    ));
  }

  private turnCompletedFn$(): CreateEffectMetadata {
    return createEffect(() => this.actions$.pipe(
      ofType(turnCompleted),
      switchMap(() => [
        resetAttackVectors(),
        resetFiredStatus(),
        clearDeadBeasts(),
      ]),
    ));
  }

  private clearDeadBeastsFn$(): CreateEffectMetadata {
    return createEffect(() => this.actions$.pipe(
      ofType(clearDeadBeasts),
      map(() => resetMoveStatus()),
    ));
  }

  private resetMoveStatusFn$(): CreateEffectMetadata {
    return createEffect(() => this.actions$.pipe(
      ofType(resetMoveStatus),
      withLatestFrom(this.store.select(selectRoundNumber)),
      map(([ action, roundNumber ]) => turnStarted({
        turn: {
          ...DEFAULT_TURN,
          roundNumber: roundNumber + 1,
        },
      })),
    ));
  }

  private gameEndedFn$(): CreateEffectMetadata {
    return createEffect(() => this.actions$.pipe(
      ofType(gameEnded),
      tap(() => this.battleService.onGameEnded()),
    ), { dispatch: false });
  }

  private applyHitFn$(): CreateEffectMetadata {
    return createEffect(() => this.actions$.pipe(
      ofType(applyHit),
      withLatestFrom(
        this.store.select(selectCharacters),
        this.store.select(selectTurn),
      ),
      map(([ action, fighters, turn ]) => {
        const cpu = fighters.find(fighter => fighter.status === STATUSES.CPU);
        const player = fighters.find(fighter => fighter.status === STATUSES.PLAYER);

        if (cpu.isAlive && player.isAlive) {
          return moveCompleted({ id: turn.movingFighter });
        }

        return setWinner({ winner: player.isAlive ? player.id : cpu.id });
      }),
    ));
  }

  private reduceSpellExpirationFn$(): CreateEffectMetadata {
    return createEffect(() => this.actions$.pipe(
      ofType(reduceSpellExpiration),
      withLatestFrom(
        this.store.select(selectSpells),
        this.store.select(selectCharacters),
        this.store.select(selectTurn),
      ),
      map(([ { spellId }, spells, fighters, turn ]) => {
        const cpu = fighters.find(fighter => fighter.status === STATUSES.CPU);
        const player = fighters.find(fighter => fighter.status === STATUSES.PLAYER);

        if (cpu.isAlive && player.isAlive) {
          return restoreFighterAfterSpell({ spell: spells.find(spell => spell.id === spellId) });
        }

        return setWinner({ winner: player.isAlive ? player.id : cpu.id });
      }),
    ));
  }

  private setWinnerFn$(): CreateEffectMetadata {
    return createEffect(() => this.actions$.pipe(
      ofType(setWinner),
      withLatestFrom(
        this.store.select(selectWinnerId),
        this.store.select(selectCharacters),
      ),
      tap(([ action, winnerId, fighters ]) => {
        const winner = fighters.find(fighter => fighter.id === winnerId);
        if (!winner) {
          throw new Error(`Cannot find winner in 'setWinnerFn$'.`);
        }
        console.log(' ');
        const winString = `$$$   Победил ${ winner.status === STATUSES.PLAYER ? 'игрок' : 'CPU' } ${ winner.name }.   $$$`;
        const winDecorate = '$'.repeat(winString.length);
        console.log(winDecorate);
        console.log(winString);
        console.log(winDecorate);
      }),
    ), { dispatch: false });
  }
}
