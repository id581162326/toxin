import {flow, pipe} from 'fp-ts/function';
import * as H from 'globals/helpers';
import * as O from 'fp-ts/Option';

import Namespace from './namespace';

class LikeButton {
  constructor(private readonly wrap: HTMLElement, private readonly props: Namespace.Props) {
    this.initButton();
  }

  private readonly button = pipe(this.wrap, H.querySelector<HTMLInputElement>('.js-like-button__input'));
  private readonly counter = pipe(this.wrap, H.querySelector<HTMLSpanElement>('.js-like-button__counter'));

  private readonly initButton = () => pipe(this.button, O.map(flow(
    H.addEventListener('click', this.handleChange),
    H.method('dispatchEvent', new Event('click'))
  )));

  private readonly setCounter = (active: boolean) => pipe(
    this.counter,
    O.map((counter) => pipe(
      counter,
      pipe(counter.innerText, Number, active ? H.inc : H.dec, H.toString, H.setInnerText)
    ))
  );

  private readonly handleChange = (event: MouseEvent) => {
    const {name, checked} = event.target as HTMLInputElement;

    this.props.onChange({[name]: checked});

    if (document.readyState === 'complete') {
      this.setCounter(checked);
    }
  };
}

export default LikeButton;