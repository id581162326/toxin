import {pipe} from 'fp-ts/function';
import * as H from 'globals/helpers';
import * as A from 'fp-ts/Array';

import Namespace from './namespace';

class RadioGroup implements Namespace.Interface {
  public readonly setDisabled = (disabled: boolean) => {
    pipe(this.radioGroup, A.map(pipe('disabled', disabled ? H.setAttribute : H.removeAttribute)));

    return (this);
  };

  constructor(private readonly container: HTMLElement, private readonly props: Namespace.Props) {
    this.initRadioGroup();
  }

  private readonly radioGroup = pipe(this.container, H.querySelectorAll<HTMLInputElement>('.js-radio-group__input'));

  private readonly initRadioGroup = () => pipe(this.radioGroup, A.map(H.addEventListener('click', this.handleCheck)));

  private readonly handleCheck = (event: MouseEvent) => {
    const target = event.target as HTMLInputElement;

    pipe(target.value, this.props.onChange);
  };
}

export default RadioGroup;