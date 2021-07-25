import {flow, pipe} from 'fp-ts/function';
import * as H from 'globals/helpers';
import * as A from 'fp-ts/Array';

import Namespace from './namespace';

class RateBar {
  constructor(private readonly wrap: HTMLElement, private readonly props: Namespace.Props) {
    this.initRadioGroup();
  }

  private readonly radioGroup = pipe(this.wrap, H.querySelectorAll<HTMLInputElement>('.js-rate-bar__input'));

  private readonly initRadioGroup = () => pipe(this.radioGroup, A.map(flow(
    H.addEventListener('click', this.handleCheck),
    H.method('dispatchEvent', new Event('click'))
  )));

  private readonly handleCheck = (event: MouseEvent) => {
    const {name, value, checked} = event.target as HTMLInputElement;

    if (checked) {
      this.props.onChange({[name]: Number(value)})
    }
  };
}

export default RateBar;