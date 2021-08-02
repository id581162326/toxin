import {pipe} from 'fp-ts/function';
import * as H from 'globals/helpers';
import * as A from 'fp-ts/Array';
import * as O from 'fp-ts/Option';
import {Option} from 'fp-ts/Option'

import TextField from 'atoms/text-field';
import Button from 'atoms/button';

import Namespace from './namepsace';

class Login {
  constructor(private readonly wrap: HTMLElement, private readonly props: Namespace.Props) {
    this.submitBtn = this.initButton();
    this.fields = this.initFields();
  }

  private loginData: Record<string, string> = {};

  private readonly fieldWraps = pipe(this.wrap, H.querySelectorAll<HTMLDivElement>('.js-login__field'));
  private readonly submitBtnWrap = pipe(this.wrap, H.querySelector<HTMLDivElement>('.js-login__submit-btn'));

  private readonly submitBtn: Option<InstanceType<typeof Button>>;
  private readonly fields: Array<InstanceType<typeof TextField>>;

  private readonly initFields = () => pipe(this.fieldWraps, A.map((wrap) => new TextField(wrap, {
    onChange: this.handleFieldChange
  })));

  private readonly initButton = () => pipe(this.submitBtnWrap, O.map((wrap) => new Button(wrap, {
    onClick: this.handleSubmit
  })));

  private readonly updateSubmitBtnDisabled = () => {
    const disabled = pipe(this.loginData, H.values, A.reduce(false, (bool, val) =>
      typeof val === 'string' && val.length === 0 ? true : bool
    ));

    pipe(this.submitBtn, O.map(H.method('setDisabled', disabled)));
  };

  private readonly setLoginData = (data: Record<string, string>) => this.loginData = {...this.loginData, ...data};

  private readonly validateFields = () => pipe(this.fields, A.map(H.method('validate')), H.includes(false), H.not);

  private readonly handleFieldChange = (data: Record<string, string>) => {
    this.setLoginData(data);
    this.updateSubmitBtnDisabled();
  };

  private readonly handleSubmit = () => {
    if (this.validateFields()) {
      this.props.onSubmit(this.loginData);
    }
  };
}

export default Login;
