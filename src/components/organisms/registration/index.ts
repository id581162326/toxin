import * as O from 'fp-ts/Option';
import {Option} from 'fp-ts/Option';
import {pipe} from 'fp-ts/function';
import * as H from 'globals/helpers';
import * as A from 'fp-ts/Array';

import TextField from 'atoms/text-field';
import Button from 'atoms/button';
import RadioGroup from 'atoms/radio-group';
import Checkbox from 'atoms/checkbox';

import Namespace from './namespace';

class Registration {
  constructor(private readonly wrap: HTMLElement, private readonly props: Namespace.Props) {
    this.submitBtn = this.initSubmitBtn();
    this.fields = this.initFields();
    this.initGenderRadio();
    this.initCheckbox();
  }

  private registrationData: Namespace.RegistrationData = {};

  private readonly submitBtn: Option<InstanceType<typeof Button>> = O.none;
  private readonly fields;

  private readonly fieldWraps = pipe(this.wrap, H.querySelectorAll<HTMLDivElement>('.js-registration__field'));
  private readonly radioGroupWrap = pipe(this.wrap, H.querySelector<HTMLDivElement>('.js-registration__radio-group'));
  private readonly checkboxWrap = pipe(this.wrap, H.querySelector<HTMLDivElement>('.js-registration__checkbox'));
  private readonly submitBtnWrap = pipe(this.wrap, H.querySelector<HTMLDivElement>('.js-registration__submit-btn'));

  private readonly initFields = () => pipe(this.fieldWraps, A.map((wrap) => new TextField(wrap, {
    onChange: this.handleFieldChange,
    ...(wrap.classList.contains('js-registration__field_with_date-mask') ? {dateMask: true} : {})
  })));

  private readonly initGenderRadio = () => pipe(this.radioGroupWrap, O.map((wrap) => new RadioGroup(wrap, {
    onChange: this.setRegistrationData
  })));

  private readonly initCheckbox = () => pipe(this.checkboxWrap, O.map((wrap) => new Checkbox(wrap, {
    onChange: this.setRegistrationData
  })))

  private readonly initSubmitBtn = () => pipe(this.submitBtnWrap, O.map((wrap) => new Button(wrap, {
    onClick: this.handleSubmit
  })));

  private readonly updateSubmitBtnDisabled = () => {
    const disabled = pipe(this.registrationData, H.values, A.reduce(false, (bool, val) =>
      typeof val === 'string' && val.length === 0 ? true : bool
    ));

    pipe(this.submitBtn, O.map(H.method('setDisabled', disabled)));
  };

  private readonly validateFields = () => pipe(this.fields, A.map(H.method('validate')), H.includes(false), H.not);

  private readonly setRegistrationData = (data: Record<string, string | boolean>) => this.registrationData = {...this.registrationData, ...data};

  private readonly handleFieldChange = (data: Record<string, string>) => {
    this.setRegistrationData(data);
    this.updateSubmitBtnDisabled();
  };

  private readonly handleSubmit = () => {
    if (this.validateFields()) {
      this.props.onSubmit(this.registrationData);
    }
  };
}


export default Registration;