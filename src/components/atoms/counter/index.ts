import * as O from 'fp-ts/Option';
import * as H from 'globals/helpers';
import * as F from 'fp-ts/function';
import {flow, pipe} from 'fp-ts/function';

import Namespace from './namespace';

class Counter implements Namespace.Interface {
  public readonly reset = () => {
    pipe(this.input, O.map((input) => {
      input.stepDown(pipe(input.value, Number));
      input.dispatchEvent(new Event('change'));
    }));

    return (this);
  };

  constructor(private readonly container: HTMLElement, private readonly props: Namespace.Props) {
    this.initCounter();
  }

  private readonly input = pipe(this.container, H.querySelector<HTMLInputElement>('.js-counter__input'));

  private readonly decrementBtn = pipe(this.container, H.querySelector<HTMLButtonElement>('.js-counter__decrement-btn'));

  private readonly incrementBtn = pipe(this.container, H.querySelector<HTMLButtonElement>('.js-counter__increment-btn'));

  private readonly initCounter = () => {
    pipe(this.decrementBtn, O.map(H.addEventListener('click', this.handleClick('dec'))));
    pipe(this.incrementBtn, O.map(H.addEventListener('click', this.handleClick('inc'))));
    pipe(this.input, O.map(flow(
      H.addEventListener('change', this.handleChange),
      H.method('dispatchEvent', new Event('change'))
    )));
  };

  private readonly handleClick = (type: 'dec' | 'inc') => () => pipe(
    this.input,
    O.map((input) => {
      pipe(type, H.switchCases([['inc', () => input.stepUp()], ['dec', () => input.stepDown()]], F.constVoid));

      input.focus();
      input.dispatchEvent(new Event('change'));
    })
  );

  private readonly handleChange = (event: Event) => {
    const target = event.target as HTMLInputElement;
    const {min, max, value, name} = target;

    pipe(true, H.switchCases([
      [target.value < min, () => target.value = min],
      [Boolean(max) && target.value > max, () => target.value = max]
    ], F.constVoid));

    pipe(this.decrementBtn, O.map(pipe('disabled', target.value !== min ? H.removeAttribute : H.setAttribute)));
    pipe(this.incrementBtn, O.map(pipe('disabled', target.value !== max ? H.removeAttribute : H.setAttribute)));

    this.props.onChange({[name]: Number(value)});
  };
}

export default Counter;