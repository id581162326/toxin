import {flow, pipe} from 'fp-ts/function';
import * as H from 'globals/helpers';
import * as O from 'fp-ts/Option';

import Namespace from './namespace';

class Checkbox {
  constructor(private readonly wrap: HTMLElement, private readonly props: Namespace.Props) {
    this.initCheckbox();
  }

  private readonly checkbox = pipe(this.wrap, H.querySelector<HTMLInputElement>('.js-checkbox__input'));

  private readonly initCheckbox = () => pipe(this.checkbox, O.map(flow(
    H.addEventListener('click', this.handleCheck),
    H.method('dispatchEvent', new Event('click'))
  )));

  private readonly handleCheck = (event: MouseEvent) => {
    const {checked, name} = event.target as HTMLInputElement;

    this.props.onChange({[name]: checked});
  };
}

export default Checkbox;