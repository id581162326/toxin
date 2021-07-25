import {pipe} from 'fp-ts/function';
import * as H from 'globals/helpers';
import * as A from 'fp-ts/Array';

import Checkbox from 'atoms/checkbox';

import Namespace from './namespace';

class CheckboxGroup {
  constructor(private readonly wrap: HTMLElement, private readonly props: Namespace.Props) {
    this.initCheckboxInstances();
    this.props.onChange(this.checkboxesData);
  }

  private checkboxesData: Namespace.CheckboxesData = {};

  private items: Array<HTMLLIElement> = pipe(this.wrap, H.querySelectorAll<HTMLLIElement>('.js-checkbox-group__item'));

  private readonly initCheckboxInstances = () => pipe(this.items, A.map((item) => pipe(Checkbox, H.instance(item, {
    onChange: this.handleCheckboxChange
  }))));

  private readonly handleCheckboxChange = (data: Namespace.CheckboxesData) => {
    this.checkboxesData = {...this.checkboxesData, ...data};

    if (document.readyState === 'complete') {
      this.props.onChange(this.checkboxesData);
    }
  };
}

export default CheckboxGroup;