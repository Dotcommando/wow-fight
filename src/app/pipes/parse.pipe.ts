import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'parse' })
export class ParsePipe implements PipeTransform {
    transform(value: string): any {
        let result;

        try {
            result = JSON.parse(value);
        } catch (err) {
            result = {};
        }

        return result;
    }
}
