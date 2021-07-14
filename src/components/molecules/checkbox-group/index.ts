import {flow, pipe} from 'fp-ts/function';
import * as H from 'globals/helpers';
import * as A from 'fp-ts/Array';
import * as O from 'fp-ts/Option';

import Checkbox from 'atoms/checkbox';

import Namespace from './namespace';

class CheckboxGroup {
  constructor(private readonly container: HTMLElement, private readonly props: Namespace.Props) {
    this.initCheckboxes();
  }

  private readonly items = pipe(this.container, H.querySelectorAll<HTMLLIElement>('.js-checkbox-group__item'));

  private readonly invalidData: Namespace.CheckboxesData = {
    ['invalid-data']: false
  };

  private checkboxesData: Namespace.CheckboxesData = pipe(
    this.items,
    A.map(flow(H.prop('dataset'))),
    A.reduce({}, (acc, {name, checked}) => pipe(
      name,
      O.fromNullable,
      O.chain((name) => pipe(checked, O.fromNullable, O.map(JSON.parse), O.chain(
        (checked) => typeof checked === 'boolean' ? O.some({[name]: checked}) : O.none))),
      O.fold(() => ({...acc, ...this.invalidData}), (data) => ({...acc, ...data})))
    )
  );

  private readonly initCheckboxes = () => pipe(this.items, A.map((item) => pipe(Checkbox, H.instance(item, {
    onChange: this.handleCheckboxChange(item)
  }))));

  private readonly handleCheckboxChange = ({dataset}: HTMLLIElement) => (checked: boolean) => pipe(
    dataset.name, O.fromNullable, O.map(this.updateCheckboxesData(checked))
  );

  private readonly updateCheckboxesData = (checked: boolean) => (name: string) => {
    this.checkboxesData = {...this.checkboxesData, [name]: checked};

    this.props.onChange(this.checkboxesData);
  };
}

export default CheckboxGroup;