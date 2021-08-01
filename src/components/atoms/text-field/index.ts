import {flow, pipe} from 'fp-ts/function';
import * as H from 'globals/helpers';
import * as O from 'fp-ts/Option';
import * as F from 'fp-ts/function';
import {dateRegexp, emailRegexp} from 'globals/utils';

import IMask from 'imask';

import Namespace from './namespace';

class TextField implements Namespace.Interface {
  public readonly validate = () => {
    const valid = pipe(this.input, O.map(({value, required, type}) => pipe(true, H.switchCases([
      [type === 'email' && required, () => H.test(emailRegexp)(value)],
      [type === 'text' && required, () => value.length !== 0],
      [Boolean(this.props.dateMask) && required, () => H.test(dateRegexp)(value)]
    ], F.constTrue))), O.getOrElse(F.constTrue));

    this.setValid(valid);

    if (!valid) {
      this.focus();
    }

    return (valid);
  };

  public readonly setValue = (value: string) => {
    pipe(this.input, O.map(H.setAttribute('value', value)));

    return (this);
  };

  public readonly setDisabled = (disabled: boolean) => {
    pipe(this.input, O.map(pipe('disabled', disabled ? H.setAttribute : H.removeAttribute)));

    return (this);
  };

  constructor(private readonly wrap: HTMLElement, private readonly props: Namespace.Props) {
    this.initInput();
  }

  private readonly root = pipe(this.wrap, H.querySelector<HTMLLabelElement>('.js-text-field'));
  private readonly input = pipe(this.wrap, H.querySelector<HTMLInputElement>('.js-text-field__input'));

  private readonly initInput = () => pipe(this.input, O.map(flow(
    this.props.dateMask ? this.setDateMask : H.ident,
    H.addEventListener('input', this.handleChange),
    H.addEventListener('keyup', this.handleEnterPress),
    H.method('dispatchEvent', new Event('input'))
  )));

  private readonly focus = () => pipe(this.input, O.map(H.method('focus')));

  private readonly setDateMask = (input: HTMLInputElement) => {
    IMask(input, {
      mask: 'DD.MM.YYYY',
      blocks: {
        DD: {
          mask: IMask.MaskedRange,
          from: 1,
          to: 31
        },
        MM: {
          mask: IMask.MaskedRange,
          from: 1,
          to: 12
        },
        YYYY: {
          mask: IMask.MaskedRange,
          from: 1900,
          to: new Date().getFullYear()
        }
      }
    });

    return (input);
  };

  private readonly setValid = (valid: boolean) => pipe(this.root, O.map(pipe(['text-field_invalid'], valid
    ? H.removeClassList : H.addClassList)));

  private readonly handleChange = (event: Event) => {
    const {value, name} = event.target as HTMLInputElement;

    this.props.onChange({[name]: value});

    this.setValid(true);
  };

  private readonly handleEnterPress = (event: KeyboardEvent) => {
    const {onEnterPress} = this.props;

    if (event.code === 'Enter' && onEnterPress) {
      onEnterPress();
    }
  };
}

export default TextField;