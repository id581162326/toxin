import {pipe} from 'fp-ts/function';
import * as H from 'globals/helpers';
import * as A from 'fp-ts/Array';

import Namespace from './namespace';
import FieldManager from './parts/field-manager';
import CountersManager from './parts/counters-manager';
import DropdownManager from './parts/dropdown-manager';

class CountersDropdown implements Namespace.Interface {
  public readonly setExpanded = (expanded: boolean) => {
    this.dropdownManager.setExpanded(expanded);

    return (this);
  };

  public readonly setDisabled = (disabled: boolean) => {
    this.fieldManager.setDisabled(disabled);

    return (this);
  };

  constructor(container: HTMLElement, private readonly props: Namespace.Props) {
    this.fieldManager = pipe(FieldManager, H.instance(container));
    this.dropdownManager = pipe(DropdownManager, H.instance(container));
    this.countersManager = pipe(CountersManager, H.instance(container, {onChange: this.handleCountersChange}));
  }

  private readonly dropdownManager: InstanceType<typeof DropdownManager>;

  private readonly countersManager: InstanceType<typeof CountersManager>;

  private readonly fieldManager: InstanceType<typeof FieldManager>;

  private readonly handleCountersChange = (countersData: Namespace.CountersData) => {
    pipe(countersData, H.values, this.fieldManager.updateValue);

    pipe(
      countersData, H.keys,
      A.zip(pipe(countersData, H.values)),
      A.reduce({}, (acc, [name, data]) => ({...acc, [name]: data.value})),
      this.props.onChange
    );
  };
}


export default CountersDropdown;