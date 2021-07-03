import { Dictionary } from '@ngrx/entity';

import { SPELLS } from '../../constants/spells.enum';
import { IAttack } from '../../models/attack-vectors.interface';
import { ICastedSpell } from '../../models/casted-spell.interface';
import { IBeastCharacter, IMainCharacter, InstanceOf } from '../../models/character.type';
import { IFightersState } from './fighters.reducer';
/*
export interface IFighterClassInitializer {
  state: IFightersState;
  assaulter: InstanceOf<IMainCharacter | IBeastCharacter>;
  attack: IAttack;
}

export interface IChange {
  id: string;
  changes: Partial<InstanceOf<IMainCharacter | IBeastCharacter>>;
}

export class FightersChanges {
  private state: IFightersState;
  private fightersDictionary: Dictionary<InstanceOf<IMainCharacter | IBeastCharacter>>;
  private assaulter: InstanceOf<IMainCharacter | IBeastCharacter>;
  private assaulterId: string;
  private attack: IAttack;
  private fighters: InstanceOf<IMainCharacter | IBeastCharacter>[] = [];
  private changes: IChange[] = [];

  constructor({ state, assaulter, attack }: IFighterClassInitializer) {
    this.state = state;
    this.fightersDictionary = state.entities;
    this.assaulter = assaulter;
    this.assaulterId = assaulter.id;
    this.attack = attack;
    this.fighters = this.mapFightersToArray();
  }

  private mapFightersToArray(): InstanceOf<IMainCharacter | IBeastCharacter>[] {
    const fighters: InstanceOf<IMainCharacter | IBeastCharacter>[] = [];

    for (const key in this.fightersDictionary) {
      if (this.fightersDictionary[key]) {
        fighters.push(this.fightersDictionary[key] as InstanceOf<IMainCharacter | IBeastCharacter>);
      }
    }

    return fighters;
  }

  private checkIsAlive(id: string): boolean {
    if (this.fightersDictionary[id]?.isAlive === false) {
      return false;
    }

    const change = this.changes.find((change: IChange) => change.id === id);

    if (change) {
      if ('isAlive' in change.changes) {
        return !!change.changes.isAlive;
      }
    }

    return true;
  }

  private countDownCastedSpells(castedSpells: ICastedSpell[]): ICastedSpell[] {
    const updatedCastedSpells: ICastedSpell[] = [];

    for (const spell of castedSpells) {
      const expiredIn = spell.expiredIn--;

      if (expiredIn >= 0) {
        updatedCastedSpells.push({ ...spell, expiredIn });
      }
    }

    return updatedCastedSpells;
  }

  private addToChanges(id: string, change: Partial<InstanceOf<IMainCharacter | IBeastCharacter>>): void {
    let index = this.changes.findIndex(change => change.id === id);

    if (index > -1) {
      this.changes[index] = { ...this.changes[index], changes: { ...this.changes[index].changes, ...change }};
    } else {
      this.changes.push({ id, changes: { ...change }});
    }
  }

  private runSpell(fighter: InstanceOf<IMainCharacter | IBeastCharacter>, spell: ICastedSpell): IChange[] {
    switch (spell.spellName) {
      case SPELLS.FEAR:
        return [
          {

          },
        ];
    }
  }

  private executeSpellsOf(id: string, fighter: InstanceOf<IMainCharacter | IBeastCharacter>): IChange[] | null {
    const spellsToExecute: ICastedSpell[] = fighter.spellBound
      .filter(spell => spell.assaulter === id);

    if (!spellsToExecute.length) {
      return null;
    }

    const changes: IChange[] = [];

    for (const spell of spellsToExecute) {
      const newChanges = this.runSpell(fighter, spell);
    }

    return changes;
  }

  private calculateAssaulterEarlyCastedSpells(): void {
    if (this.assaulter.spellsCasted.length) {
      const updatedSpellsCasted = this.countDownCastedSpells(this.assaulter.spellsCasted);

      this.addToChanges(this.assaulterId, { spellsCasted: updatedSpellsCasted });
    }

    let changes: IChange[] = [];

    for (const fighter of this.fighters) {
      if (!this.checkIsAlive(fighter.id) || !fighter.spellBound.length) {
        continue;
      }

      if (fighter.spellBound.length) {
        const newChanges = this.executeSpellsOf(this.assaulterId, fighter);

        if (newChanges?.length) {
          changes = changes.concat(newChanges);
        }
      }
    }
  }
}
*/
