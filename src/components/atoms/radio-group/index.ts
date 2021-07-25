import {flow, pipe} from 'fp-ts/function';
import * as H from 'globals/helpers';
import * as A from 'fp-ts/Array';

import Namespace from './namespace';

class RadioGroup implements Namespace.Interface {
  public readonly setDisabled = (disabled: boolean) => {
    pipe(this.radioGroup, A.map(pipe('disabled', disabled ? H.setAttribute : H.removeAttribute)));

    return (this);
  };

  constructor(private readonly wrap: HTMLElement, private readonly props: Namespace.Props) {
    this.initRadioGroup();
  }

  private readonly radioGroup = pipe(this.wrap, H.querySelectorAll<HTMLInputElement>('.js-radio-group__input'));

  private readonly initRadioGroup = () => pipe(this.radioGroup, A.map(flow(
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

export default RadioGroup;