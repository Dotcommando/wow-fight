import { Injectable } from '@angular/core';

import { MOVE_STATUSES } from '../constants/move-statuses.enum';
import { GAME_SETTINGS, PRIORITY_QUERY } from '../constants/settings.constant';
import { ALL_SPELLS } from '../constants/spells.constant';
import { SPELL_TARGET, SPELLS } from '../constants/spells.enum';
import { IAttackVectorProcessing } from '../models/attack-vector-processing.interface';
import { ICastedSpell, STAGE, STAGE_OF } from '../models/casted-spell.interface';
import { IBeastCharacter, IMainCharacter, InstanceOf } from '../models/character.type';
import { CombinedFightersParties } from '../models/combined-fighter-parties.type';
import { IAssaulterEnemies } from '../models/player-enemies.interface';
import { setSpellDamage } from '../store/damage/damage.actions';
import { addSpell, executeHit, reduceSpellCooldown } from '../store/spells/spells.actions';
import { calculateAttackVector } from '../store/turn/turn.actions';

@Injectable({
  providedIn: 'root',
})
export class BattleService {
  constructor() {
    this.filterActiveFighterAndEnemies = this.filterActiveFighterAndEnemies.bind(this);
    this.calculateSkip = this.calculateSkip.bind(this);
    this.calculateHit = this.calculateHit.bind(this);
    this.calculateSpellCasting = this.calculateSpellCasting.bind(this);
    this.executionSpells = this.executionSpells.bind(this);
  }

  private filterAssaulterEnemies = ([ action, assaulterId, fighters, parties, spells ]: CombinedFightersParties): IAssaulterEnemies => {
    const assaulter = fighters.find(fighter => fighter.id === assaulterId) as InstanceOf<IMainCharacter>;
    const enemyPartyId = assaulter.partyId === parties.cpuPartyId
      ? parties.playerPartyId
      : parties.cpuPartyId;
    const enemies = fighters.filter(fighter => fighter.partyId === enemyPartyId && fighter.isAlive);

    return { assaulter, enemies, spells };
  };

  public filterActiveFighterAndEnemies = (fightersParties: CombinedFightersParties): IAssaulterEnemies =>
    this.filterAssaulterEnemies(fightersParties);

  public calculateSkip = (assaulterEnemies: IAssaulterEnemies): IAttackVectorProcessing => ({
    assaulterEnemies,
    attackVector: {
      skip: assaulterEnemies.assaulter.canNotAttack,
    },
  } as IAttackVectorProcessing);

  public calculateHit = (attackVector: IAttackVectorProcessing): IAttackVectorProcessing => {
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

  public calculateSpellCasting = (attackVector: IAttackVectorProcessing): IAttackVectorProcessing => {
    const { assaulter, enemies, spells } = attackVector.assaulterEnemies;

    if (assaulter.canNotCast || !assaulter.spells) {
      return attackVector;
    }

    attackVector.attackVector.cast = [];

    const availableAssaulterSpells: SPELLS[] = assaulter.spells.length
      ? assaulter.spells.filter(spell => !spells.some(castedSpell => castedSpell.spellName === spell))
      : [];

    if (!availableAssaulterSpells?.length) {
      return attackVector;
    }

    for (const spell of availableAssaulterSpells) {
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
      } else {
        if (spellProto.target === SPELL_TARGET.ENEMY) {
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
        }
      }
    }

    return attackVector;
  }

  public executionSpells = (stage: STAGE, defaultAction: typeof executeHit | typeof calculateAttackVector) => ([ action, spells, currentTurn, attack, fighters ]) => {
    if (attack.spell) {
      return addSpell({ attack });
    }

    // If casted by assaulter
    const castedSpellsToExec: ICastedSpell[] = spells.filter(spell =>
      !spell.coolDownReduced
      && (spell.fireOnStage === stage && spell.stageOf === STAGE_OF.ASSAULTER)
      && spell.assaulter === currentTurn.movingFighter);

    if (castedSpellsToExec?.length) {
      return reduceSpellCooldown({ spellId: castedSpellsToExec[0].id });
    }

    // If it's time to apply spell
    const boundSpellsToExec: ICastedSpell[] = spells.filter(spell =>
      !spell.firedInThisTurn
      && (spell.fireOnStage === stage
        && (
          (currentTurn.movingFighter === spell.target && spell.stageOf === STAGE_OF.TARGET)
          || (currentTurn.movingFighter === spell.assaulter && spell.stageOf === STAGE_OF.ASSAULTER)
        )
      ));

    if (boundSpellsToExec?.length) {
      const assaulterId = fighters.ids.find(fighterId => fighterId === boundSpellsToExec[0].assaulter);
      const targetId = fighters.ids.find(fighterId => fighterId === boundSpellsToExec[0].target);
      const assaulter = fighters.entities[assaulterId] ?? null;
      const target = fighters.entities[targetId] ?? null;

      return setSpellDamage({ spell: boundSpellsToExec[0], target, assaulter });
    }

    return defaultAction();
  }

  public onGameStarted(): void {
    console.log('Game Started');
  }

  public onTurnStarted(): void {
    console.log('Turn Started');
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
}
