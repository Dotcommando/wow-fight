import { MOVE_STATUSES } from '../constants/move-statuses.enum';
import { GAME_SETTINGS, PARTIES_QUERY, PRIORITY_QUERY } from '../constants/settings.constant';
import { IBeastCharacter, IMainCharacter, InstanceOf } from '../models/character.type';

export function findNextFighter(fighters: InstanceOf<IMainCharacter | IBeastCharacter>[], parties: { playerPartyId: string; cpuPartyId: string }): InstanceOf<IMainCharacter | IBeastCharacter> | null {
  let nextPartyFighters: InstanceOf<IMainCharacter | IBeastCharacter>[] = fighters
    .filter(fighter => fighter.move === MOVE_STATUSES.NOT_MOVED)
    .filter(fighter =>
      fighter.partyId === (GAME_SETTINGS.partyFirst === PARTIES_QUERY.PLAYER_FIRST ? parties.playerPartyId : parties.cpuPartyId),
    );

  if (!nextPartyFighters?.length) {
    nextPartyFighters = fighters.filter(fighter => fighter.move === MOVE_STATUSES.NOT_MOVED);
  }

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

  if (!nextPartyFighter) return null;

  return nextPartyFighter;
}
