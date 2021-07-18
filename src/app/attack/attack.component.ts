import { ChangeDetectionStrategy, ChangeDetectorRef, Component, forwardRef, Input } from '@angular/core';
import { FormControl, NG_VALUE_ACCESSOR } from '@angular/forms';
import { MatRadioChange } from '@angular/material/radio';

import { AttackVector, IAttackVectors } from '../models/attack-vectors.interface';
import { IBeastCharacter, IMainCharacter, InstanceOf } from '../models/character.type';

@Component({
  selector: 'app-attack',
  templateUrl: './attack.component.html',
  styleUrls: ['./attack.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => AttackComponent),
    multi: true,
  }],
})
export class AttackComponent {

  private _attackVectors!: IAttackVectors | null;

  @Input()
  set attackVectors(newAttackVectors: IAttackVectors | null) {
    this._attackVectors = newAttackVectors;
    this.cd.markForCheck();
  }

  get attackVectors(): IAttackVectors | null {
    return this._attackVectors;
  }


  private _allCharacter!: InstanceOf<IMainCharacter | IBeastCharacter>[] | null;

  @Input()
  set allEntities(newAllCharacters: InstanceOf<IMainCharacter | IBeastCharacter>[] | null) {
    this._allCharacter = newAllCharacters;
    this.cd.markForCheck();
  }

  get allEntities(): InstanceOf<IMainCharacter | IBeastCharacter>[] | null {
    return this._allCharacter;
  }


  _playerCharacter!: InstanceOf<IMainCharacter | IBeastCharacter> | null;

  @Input()
  set playerCharacter(newPlayerCharacter: InstanceOf<IMainCharacter | IBeastCharacter> | null) {
    this._playerCharacter = newPlayerCharacter;
  }

  get playerCharacter(): InstanceOf<IMainCharacter | IBeastCharacter> | null {
    return this._playerCharacter;
  }


  public attacksControl = new FormControl('', {});

  public value!: AttackVector;

  // @ts-ignore
  private onChange: (value: AttackVector) => void;

  // @ts-ignore
  private onTouched: (value: AttackVector) => void;

  public registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  public registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  public writeValue(value: AttackVector): void {
    this.value = value;
  }

  constructor(
    private cd: ChangeDetectorRef,
  ) { }

  public changeAttack(attackOption: MatRadioChange): void {
    this.writeValue(attackOption.value as AttackVector);
    this.onChange(attackOption.value as AttackVector);
    this.cd.detectChanges();
  }
}
