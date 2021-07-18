import { Component, Input } from '@angular/core';

import { IBeastCharacter, IMainCharacter, InstanceOf } from '../../models/character.type';

@Component({
  selector: 'app-character-card',
  templateUrl: './character-card.component.html',
  styleUrls: ['./character-card.component.scss'],
})
export class CharacterCardComponent {
    @Input()
    character: InstanceOf<IMainCharacter | IBeastCharacter> | null = null;

    @Input()
    party: 'Вы' | 'CPU' | null = null;

    constructor() {}
}
