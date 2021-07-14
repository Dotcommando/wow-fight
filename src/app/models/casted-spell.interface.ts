import { SPELLS } from '../constants/spells.enum';

export enum STAGE {
  BEFORE_MOVE = 'before move',
  AFTER_MOVE = 'after move',
}

export enum STAGE_OF {
  ASSAULTER = 'assaulter',
  TARGET = 'target',
}

export interface ICastedSpell {
  id: string;  // ID заклинания.
  spellName: SPELLS;   // Spell name.
  expiredIn: number;   // Через сколько ходов прекратит действовать.
  coolDown: number;
  target: string | null; // ID цели.
  assaulter: string;   // ID атакующего.
  calledBeastId?: string; // ID призванного существа.
  fireOnStage: STAGE; // Заклинание выполнять до или после хода
  stageOf: STAGE_OF;  // атакующего или жертвы.
  firedInThisTurn: boolean; // Заклинание отработало в этом ходу.
}
