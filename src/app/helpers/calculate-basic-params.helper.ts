import { MULTIPLIERS } from '../constants/multipliers.constant';
import { ICalculatedParams } from '../models/calculated-params.interface';
import { ICharacterData } from '../models/character-data.interface';

export function calculateBasicParams(characterData: ICharacterData): ICalculatedParams {
  const calculatedParams: ICalculatedParams = { dps: 0, hp: 0, crit: 0 };
  const multipliers = MULTIPLIERS;

  for (const param in calculatedParams) {
    for (const property in multipliers) {
      // @ts-ignore
      if (param in multipliers[property]) {
        // @ts-ignore
        calculatedParams[param] += multipliers[property][param] * characterData[property];
      }
    }
  }

  return calculatedParams;
}
