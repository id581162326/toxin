import {flow, pipe} from 'fp-ts/function';
import * as H from 'globals/helpers';
import * as A from 'fp-ts/Array';

import Namespace from './namespace';

class Radio {
  constructor(private readonly bemBlockName: string, protected readonly wrap: HTMLElement, protected readonly props: Namespace.Props) {
    this.initRadio();
  }

  protected readonly buttons = pipe(this.wrap, H.querySelectorAll<HTMLInputElement>(`.js-${this.bemBlockName}__input`));

  private readonly initRadio = () => pipe(this.buttons, A.map(flow(
    H.addEventListener('click', this.handleCheck),
    H.method('dispatchEvent', new Event('click'))
  )));

  private readonly handleCheck = (event: MouseEvent) => {
    const {value, name, checked} = event.target as HTMLInputElement;

    if (checked) {
      this.props.onChange({[name]: value});
    }
  };
}

export default Radio;