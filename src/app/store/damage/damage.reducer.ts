import { Action, createReducer, on } from '@ngrx/store';

import { NAMES } from '../../constants/name.enum';
import { GAME_SETTINGS, PRIORITY_QUERY } from '../../constants/settings.constant';
import { ALL_SPELLS } from '../../constants/spells.constant';
import { SPELLS } from '../../constants/spells.enum';
import { STATUSES } from '../../constants/statuses.enum';
import { IBeastCharacter, IMainCharacter, InstanceOf } from '../../models/character.type';
import { IDamage } from '../../models/damage.interface';
import { resetDamage, setHitDamage, setSpellDamage } from './damage.actions';

export const damageFeatureKey = 'damage';

export const initialState: IDamage = {
  date: 0,
  assaulter: '',
  target: '',
  isSpell: false,
  isHit: false,
  isSkip: true,
  critFired: false,
  damage: null,
  targetChanges: null,
  spellName: null,
  spellId: null,
  callBeast: false,
  beastParams: null,
};

const damageReducerFn = createReducer(
  initialState,
  on(setHitDamage,
    (state, { damage }) => ({ ...damage }),
  ),
  on(setSpellDamage,
    (state, { spell, target, assaulter }) => {
      const spellEntity = ALL_SPELLS.find(spellFromSpellsLIst => spellFromSpellsLIst.name === spell.spellName);

      if (!spellEntity) throw new Error(`Cannot find spell ${spell.spellName} in list of spells.`);
      if (spell.expiredIn <= 0 || !target?.isAlive || !target) {
        return {
          date: Date.now(),
          assaulter: assaulter.id,
          target: null,
          isSpell: true,
          isHit: false,
          isSkip: true,
          critFired: false,
          damage: null,
          targetChanges: null,
          spellName: spell.spellName,
          spellId: spell.id,
          callBeast: false,
          beastParams: null,
        } as IDamage;
      }

      const changes: Partial<InstanceOf<IMainCharacter | IBeastCharacter>> = {};

      switch (spell.spellName) {
        case SPELLS.ANCESTRAL_SPIRIT:
          changes.hp = target.hp + spellEntity.HPDelta > target.inheritedHp
            ? target.inheritedHp
            : target.hp + spellEntity.HPDelta;

          break;

        case SPELLS.FILTH:
          const hpResult = target.hp - spellEntity.HPDelta;

          changes.hp = hpResult < 0
            ? 0
            : hpResult;

          if (hpResult < 0) {
            changes.isAlive = false;
          }

          break;

        case SPELLS.FEAR:
          changes.canNotAttack = spellEntity.canNotAttack;
          changes.canNotCast = spellEntity.canNotCast;

          break;

        case SPELLS.REBIRTH:
          const skeletonPriority = GAME_SETTINGS.priority === PRIORITY_QUERY.LOWEST_FIRST
            ? assaulter.priority - 1
            : assaulter.priority + 1;

          return {
            date: Date.now(),
            assaulter: assaulter.id,
            target: target.id,
            isSpell: true,
            isHit: false,
            isSkip: false,
            critFired: false,
            damage: null,
            targetChanges: null,
            spellName: spell.spellName,
            spellId: spell.id,
            callBeast: true,
            beastParams: {
              beastName: NAMES.SKELETON,
              partyId: assaulter.partyId,
              priority: skeletonPriority,
              status: assaulter.status === STATUSES.PLAYER ? STATUSES.PLAYERS_BEAST : STATUSES.CPUS_BEAST,
            },
          };

        default:
          break;
      }

      return {
        date: Date.now(),
        assaulter: assaulter.id,
        target: target.id,
        isSpell: true,
        isHit: false,
        isSkip: false,
        critFired: false,
        damage: null,
        targetChanges: changes,
        spellName: spell.spellName,
        spellId: spell.id,
        callBeast: false,
        beastParams: null,
      } as IDamage;
    },
  ),
  on(resetDamage,
    () => ({ ...initialState }),
  ),
);

export function reducer(state: IDamage, action: Action): IDamage {
  return damageReducerFn(state, action);
}
