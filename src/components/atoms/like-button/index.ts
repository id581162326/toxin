import Namespace from './namespace';
import {pipe} from 'fp-ts/function';
import * as H from 'globals/helpers';
import * as O from 'fp-ts/Option';

class LikeButton {
  constructor(private readonly container: HTMLElement, private readonly props: Namespace.Props) {
    this.initButton();
  }

  private readonly button = pipe(this.container, H.querySelector<HTMLInputElement>('.js-like-button__input'));

  private readonly counter = pipe(this.container, H.querySelector<HTMLSpanElement>('.js-like-button__count'));

  private readonly initButton = () => pipe(this.button, O.map(H.addEventListener('click', this.handleChange)));

  private readonly setCounter = (active: boolean) => pipe(
    this.counter,
    O.map((counter) => pipe(
      counter,
      pipe(counter.innerText, Number, active ? H.inc : H.dec, H.toString, H.setInnerText)
    ))
  );

  private readonly handleChange = (event: MouseEvent) => {
    const target = event.target as HTMLInputElement;

    this.props.onChange(target.checked);

    this.setCounter(target.checked);
  };
}

export default LikeButton;