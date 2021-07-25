import * as F from 'fp-ts/function';
import {flow, pipe} from 'fp-ts/function';
import * as H from 'globals/helpers';
import * as O from 'fp-ts/Option';
import {emailRegexp} from 'globals/utils';

import Namespace from './namespace';

class SubscribeField {
  constructor(private readonly wrap: HTMLElement, private readonly props: Namespace.Props) {
    this.initSubmitBtn();
    this.initInput();
  }

  private readonly root = pipe(this.wrap, H.querySelector<HTMLDivElement>('.js-subscribe-field'));
  private readonly input = pipe(this.wrap, H.querySelector<HTMLInputElement>('.js-subscribe-field__input'));
  private readonly button = pipe(this.wrap, H.querySelector<HTMLButtonElement>('.js-subscribe-field__submit-btn'));

  private readonly initInput = () => pipe(this.input, O.map(flow(
    H.addEventListener('input', this.handleOnChange),
    H.addEventListener('keyup', this.handleEnterKeyPress)
  )));

  private readonly initSubmitBtn = () => pipe(this.button, O.map(H.addEventListener('click', this.submitValue)));

  private readonly handleOnChange = () => this.setValid(true);

  private readonly handleEnterKeyPress = ({code}: KeyboardEvent) => code === 'Enter' ? this.submitValue() : F.constVoid();

  private readonly submitValue = () => pipe(this.input, O.map(({value}) => pipe(
    value, this.validateValue(value) ? this.props.onSubmit : H.ident
  )));

  private readonly validateValue = (value: string) => pipe(true, H.switchCases([
    [!H.test(emailRegexp)(value), () => this.setValid(false)],
    [value.length === 0, () => this.setValid(false)]
  ], F.constTrue));

  private readonly setValid = (valid: boolean) => {
    pipe(this.input, O.map(!valid ? H.method('focus') : H.ident));

    pipe(this.root, O.map(pipe(['subscribe-field_invalid'], valid ? H.removeClassList : H.addClassList)));

    return (valid);
  };
}


export default SubscribeField;