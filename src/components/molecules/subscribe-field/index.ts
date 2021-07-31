import * as F from 'fp-ts/function';
import {flow, pipe} from 'fp-ts/function';
import * as H from 'globals/helpers';
import * as O from 'fp-ts/Option';
import {Option} from 'fp-ts/Option';
import {emailRegexp} from 'globals/utils';

import TextField from 'atoms/text-field';
import Button from 'atoms/button';

import Namespace from './namespace';

class SubscribeField {
  constructor(private readonly wrap: HTMLElement, private readonly props: Namespace.Props) {
    this.initButton();
    this.textField = this.initTextField();
  }

  private value = '';

  private readonly inputWrap = pipe(this.wrap, H.querySelector<HTMLInputElement>('.js-subscribe-field__input'));
  private readonly submitBtnWrap = pipe(this.wrap, H.querySelector<HTMLDivElement>('.js-subscribe-field__submit-btn'));

  private readonly textField: Option<InstanceType<typeof TextField>>;

  private readonly initTextField = () => pipe(this.inputWrap, O.map((wrap) => pipe(
    TextField, H.instance(wrap, {onChange: this.handleOnChange, onEnterPress: this.handleEnterKeyPress})
  )));

  private readonly initButton = () => pipe(this.submitBtnWrap, O.map((wrap) => pipe(
    Button, H.instance(wrap, {onClick: this.submitValue})
  )));

  private readonly submitValue = () => pipe(this.value, this.validateValue() ? this.props.onSubmit : H.ident);

  private readonly validateValue = () => pipe(true, H.switchCases([
    [!H.test(emailRegexp)(this.value), () => {
      this.setFieldValid(false);

      return false;
    }],
    [this.value.length === 0, () => {
      this.setFieldValid(false);

      return false;
    }]
  ], F.constTrue));

  private readonly setFieldValid = (valid: boolean) => pipe(this.textField, O.map(flow(
    H.method('setValid', valid), H.method('focus')
  )));

  private readonly handleOnChange = (value: string) => {
    this.value = value;

    this.setFieldValid(true);
  };

  private readonly handleEnterKeyPress = () => this.submitValue();
}


export default SubscribeField;