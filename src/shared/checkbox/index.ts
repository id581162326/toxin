import {pipe} from 'fp-ts/function';
import * as H from 'globals/helpers';
import * as O from 'fp-ts/Option';

import './style.css';
import Namespace from './namespace';

class Checkbox {
  constructor(private readonly container: HTMLElement, private readonly props: Namespace.Props) {
    this.initCheckbox();
  }

  private readonly checkbox = pipe(this.container, H.querySelector<HTMLInputElement>('.js-checkbox__input'));

  private readonly initCheckbox = () => pipe(this.checkbox, O.map(H.addEventListener('click', this.handleClick)));

  private readonly handleClick = (event: MouseEvent) => {
    const target = event.target as HTMLInputElement;

    pipe(target.checked, this.props.onChange);
  };
}

export default Checkbox;