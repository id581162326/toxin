import {pipe} from 'fp-ts/function';
import * as H from 'globals/helpers';
import * as A from 'fp-ts/Array';

import Namespace from './namespace';
import DropdownManager from './parts/dropdown-manager';
import FieldManager from './parts/field-manager';
import CountersManager from './parts/counters-manager';

class CountersDropdown {
  constructor(private readonly wrap: HTMLElement, private readonly props: Namespace.Props) {
    this.fieldManager = new FieldManager(wrap);
    this.dropdownManager = new DropdownManager(wrap);
    this.countersManager = new CountersManager(wrap, {
      counters: props.counters,
      autoApply: props.autoApply,
      onChange: this.handleCountersChange,
      onApply: this.handleApply
    });
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

  private readonly handleApply = () => {
    this.dropdownManager.setExpanded(false);
  };
}


export default CountersDropdown;