import { Component, Input, OnInit } from '@angular/core';

import { IBeastCharacter, IMainCharacter, InstanceOf } from '../../models/character.type';

@Component({
  selector: 'app-character-card',
  templateUrl: './character-card.component.html',
  styleUrls: ['./character-card.component.scss'],
})
export class CharacterCardComponent implements OnInit {
    @Input()
    character: InstanceOf<IMainCharacter | IBeastCharacter> | null = null;

    @Input()
    party: 'Вы' | 'CPU' | null = null;

    constructor() {}

    // eslint-disable-next-line @angular-eslint/no-empty-lifecycle-method
    ngOnInit(): void {}
}
