import {pipe} from 'fp-ts/function';
import * as H from 'globals/helpers';
import * as O from 'fp-ts/Option';

import Namespace from './namespace';

class Checkbox implements Namespace.Interface {
  public readonly setDisabled = (disabled: boolean) => {
    pipe(this.checkbox, O.map(pipe('disabled', disabled ? H.setAttribute : H.removeAttribute)));

    return (this);
  };

  constructor(private readonly container: HTMLElement, private readonly props: Namespace.Props) {
    this.initCheckbox();
  }

  private readonly checkbox = pipe(this.container, H.querySelector<HTMLInputElement>('.js-checkbox__input'));

  private readonly initCheckbox = () => pipe(this.checkbox, O.map(H.addEventListener('click', this.handleCheck)));

  private readonly handleCheck = (event: MouseEvent) => {
    const target = event.target as HTMLInputElement;

    pipe(target.checked, this.props.onChange);
  };
}

export default Checkbox;