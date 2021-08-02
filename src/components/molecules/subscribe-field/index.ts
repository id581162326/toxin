import {pipe} from 'fp-ts/function';
import * as H from 'globals/helpers';
import * as O from 'fp-ts/Option';
import {Option} from 'fp-ts/Option';
import * as F from 'fp-ts/function';

import TextField from 'atoms/text-field';
import Button from 'atoms/button';

import Namespace from './namespace';

class SubscribeField {
  constructor(private readonly wrap: HTMLElement, private readonly props: Namespace.Props) {
    this.textField = this.initTextField();
    this.initButton();
  }

  private value = '';

  private readonly inputWrap = pipe(this.wrap, H.querySelector<HTMLInputElement>('.js-subscribe-field__input'));
  private readonly submitBtnWrap = pipe(this.wrap, H.querySelector<HTMLDivElement>('.js-subscribe-field__submit-btn'));

  private readonly textField: Option<InstanceType<typeof TextField>> = O.none;

  private readonly initTextField = () => pipe(this.inputWrap, O.map((wrap) => new TextField(wrap, {
    onChange: this.handleOnChange,
    onEnterPress: this.submitValue
  })));

  private readonly initButton = () => pipe(this.submitBtnWrap, O.map((wrap) => new Button(wrap, {
    onClick: this.handleSubmit
  })));

  private readonly submitValue = () => pipe(this.value, this.props.onSubmit);

  private readonly validateField = () => pipe(this.textField, O.map(H.method('validate')), O.getOrElse(F.constTrue));

  private readonly handleSubmit = () => {
    if (this.validateField()) {
      this.submitValue();
    }
  };

  private readonly handleOnChange = (data: Record<string, string>) => this.value = H.values(data)[0];
}


export default SubscribeField;