import { Injectable } from '@angular/core';

import { Actions, createEffect, CreateEffectMetadata, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';

import { map, switchMap, tap, withLatestFrom } from 'rxjs/operators';

import { DEFAULT_TURN } from '../../constants/default-turn.constant';
import { GAME_SETTINGS, PARTIES_QUERY, PRIORITY_QUERY } from '../../constants/settings.constant';
import { IBeastCharacter, IMainCharacter, InstanceOf } from '../../models/character.type';
import { BattleService } from '../../services/battle.service';
import { fighterHasStartedMove } from '../fighters/fighters.actions';
import { selectCharacters, selectParties } from '../fighters/fighters.selectors';
import { executeSpells } from '../spells/spells.actions';
import { gameEnded, gameStarted, phaseAfterMove, turnChangeNextFighter, turnCompleted, turnStarted } from './turn.actions';


@Injectable()
export class TurnEffects {
  public gameStarted$ = this.gameStartedFn$();
  public turnStarted$ = this.turnStartedFn$();
  public turnChangeNextFighter$ = this.turnChangeNextFighterFn$();
  public moveStarted$ = this.moveStartedFn$();
  public turnCompleted$ = this.turnCompletedFn$();
  public gameEnded$ = this.gameEndedFn$();
  public phaseAfterMove$ = this.phaseAfterMoveFn$();


  constructor(
    private actions$: Actions,
    private store: Store,
    private battleService: BattleService,
  ) {
  }

  private gameStartedFn$(): CreateEffectMetadata {
    return createEffect(() => this.actions$.pipe(
      ofType(gameStarted),
      tap(() => this.battleService.onGameStarted()),
      map(({ playerId, playerPartyId }) => turnStarted({
        turn: {
          ...DEFAULT_TURN,
          roundNumber: this.battleService.getCurrentRound(),
          activeParty: playerPartyId,
          movingFighter: playerId,
        },
      })),
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
        const nextPartyFighters: InstanceOf<IMainCharacter | IBeastCharacter>[] = fighters
          .filter(fighter =>
            fighter.partyId === (GAME_SETTINGS.partyFirst === PARTIES_QUERY.PLAYER_FIRST ? parties.playerPartyId : parties.cpuPartyId),
          );

        const nextPartyFighter = nextPartyFighters.reduce((fighter, nextFighter) => {
          if (GAME_SETTINGS.priority === PRIORITY_QUERY.LOWEST_FIRST) {
            if (fighter.priority < nextFighter.priority) {
              return fighter;
            } else {
              return nextFighter;
            }
          } else {
            if (fighter.priority > nextFighter.priority) {
              return fighter;
            } else {
              return nextFighter;
            }
          }
        }, nextPartyFighters[0]);

        if (!nextPartyFighter) throw  new Error('Cannot choose fighter in \'turnStarted\' effect.');

        return turnChangeNextFighter({ nextFighter: nextPartyFighter.id, nextPartyId: nextPartyFighter.partyId });
      }),
    ));
  }

  private turnChangeNextFighterFn$(): CreateEffectMetadata {
    return createEffect(() => this.actions$.pipe(
      ofType(turnChangeNextFighter),
      map(() => fighterHasStartedMove()),
    ));
  }

  private moveStartedFn$(): CreateEffectMetadata {
    return createEffect(() => this.actions$.pipe(
      ofType(fighterHasStartedMove),
      tap(() => this.battleService.onPlayerMoveStarted()),
      switchMap(() => this.battleService.calculateAttackVectors$),
    ), { dispatch: false });
  }

  private turnCompletedFn$(): CreateEffectMetadata {
    return createEffect(() => this.actions$.pipe(
      ofType(turnCompleted),
      tap(() => this.battleService.onTurnCompleted()),
      map(() => turnStarted({
        turn: {
          ...DEFAULT_TURN,
          roundNumber: this.battleService.getCurrentRound(),
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

  private phaseAfterMoveFn$() : CreateEffectMetadata {
    return createEffect(() => this.actions$.pipe(
      ofType(phaseAfterMove),
      map(() => executeSpells()),
    ));
  }
}
