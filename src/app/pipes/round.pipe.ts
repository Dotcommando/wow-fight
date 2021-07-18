import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'round' })
export class RoundPipe implements PipeTransform {
  transform(value: number, zeroes = 0): number {
    const zeroesAfterPoint = zeroes > 0 ? zeroes : 2;
    const multiplier = Math.pow(10, zeroesAfterPoint);
    return Math.round(value * multiplier) / multiplier;
  }
}
