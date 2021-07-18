export enum PARTIES_QUERY {
  PLAYER_FIRST = 'player moves first',
  CPU_FIRST = 'CPU moves first',
}

export enum PRIORITY_QUERY {
  HIGHEST_FIRST = 'character with highest priority is first',
  LOWEST_FIRST = 'character with lowest priority is first',
}

export const GAME_SETTINGS = {
  partyFirst: PARTIES_QUERY.PLAYER_FIRST,
  priority: PRIORITY_QUERY.LOWEST_FIRST,
};
