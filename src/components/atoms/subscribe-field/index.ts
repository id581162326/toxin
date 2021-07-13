import * as F from 'fp-ts/function';
import {flow, pipe} from 'fp-ts/function';
import * as H from 'globals/helpers';
import * as O from 'fp-ts/Option';

import Namespace from './namespace';

class SubscribeField {
  constructor(private readonly container: HTMLElement, private readonly props: Namespace.Props) {
    this.initSubmitBtn();
    this.initInput();
  }

  private readonly root = pipe(this.container, H.querySelector<HTMLDivElement>('.js-subscribe-field'));

  private readonly input = pipe(this.container, H.querySelector<HTMLInputElement>('.js-subscribe-field__input'));

  private readonly submitBtn = pipe(this.container, H.querySelector<HTMLButtonElement>('.js-subscribe-field__submit-btn'));

  private readonly initInput = () => pipe(this.input, O.map(flow(
    H.addEventListener('input', this.handleOnChange),
    H.addEventListener('keyup', this.handleEnterKeyPress)
  )));

  private readonly initSubmitBtn = () => pipe(this.submitBtn, O.map(H.addEventListener('click', this.submitValue)));

  private readonly handleOnChange = () => this.setValid(true);

  private readonly handleEnterKeyPress = ({code}: KeyboardEvent) => code === 'Enter' ? this.submitValue() : F.constVoid();

  private readonly submitValue = () => pipe(this.input, O.map(({value}) => pipe(
    value, this.validateValue(value) ? this.props.onSubmit : H.ident
  )));

  private readonly validateValue = (value: string) => pipe(true, H.switchCases([
    [!H.validateEmail(value), () => this.setValid(false)],
    [value.length === 0, () => this.setValid(false)]
  ], F.constTrue));

  private readonly setValid = (valid: boolean) => {
    if (!valid) {
      pipe(this.input, O.map(H.method('focus')));
    }

    pipe(this.root, O.map(pipe(['subscribe-field_invalid'], valid ? H.removeClassList : H.addClassList)));

    return (valid);
  };
}


export default SubscribeField;