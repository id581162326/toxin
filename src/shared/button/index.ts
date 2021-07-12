import {pipe} from 'fp-ts/function';
import * as H from 'globals/helpers';
import * as O from 'fp-ts/Option';

import './style.css';
import Namespace from './namespace';

class Button implements Namespace.Interface {
  public readonly setDisabled = (disabled: boolean) => {
    pipe(this.button, O.map(pipe('disabled', disabled ? H.setAttribute : H.removeAttribute)));

    return (this);
  };

  public readonly setLabel = (label: string) => {
    pipe(this.label, O.map(H.setInnerText(label)));

    return (this);
  };

  constructor(private readonly container: HTMLElement, private readonly props: Namespace.Props) {
    this.initButton();
  }

  private readonly button = pipe(this.container, H.querySelector<HTMLButtonElement>('.js-button'));

  private readonly label = pipe(this.container, H.querySelector<HTMLSpanElement>('.js-button__label'));

  private readonly initButton = () => pipe(this.button, O.map(H.addEventListener('click', this.props.onClick)));
}

export default Button;