import { ITurn } from '../models/turn.interface';

export function compareITurnArrays(a: ITurn[], b: ITurn[]): boolean {
  if (a.length !== b.length) {
    return false;
  }

  const lastElementIndex = a.length - 1;

  if (Object.keys(a[lastElementIndex]).length !== Object.keys(b[lastElementIndex]).length) {
    console.log('b and a have different number of properties.');
    return false;
  }

  for (const key in b[lastElementIndex]) {
    if (!(key in a[lastElementIndex])) {
      console.log('b has key which is absent at a.');
      return false;
    }

    // @ts-ignore
    if (a[lastElementIndex][key] !== b[lastElementIndex][key]) {
      console.log('key of b has different value in a.');
      return false;
    }
  }

  return true;
}
