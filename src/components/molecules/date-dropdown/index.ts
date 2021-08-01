import {pipe} from 'fp-ts/function';
import * as H from 'globals/helpers';
import {Option} from 'fp-ts/Option';
import * as R from 'fp-ts/Record';

import Namespace from './namespace';
import DropdownManager from './parts/dropdown-manager';
import DatepickerManager from './parts/datepicker-manager';
import FieldManager from './parts/field-manager';

class DateDropdown implements Namespace.Interface {
  public readonly setDisabled = (disabled: boolean) => {
    this.fieldManager.setDisabled(disabled);

    return (this)
  }

  public readonly setExpanded = (expanded: boolean) => {
    this.dropdownManager.setExpanded(expanded);

    return (this)
  }

  constructor(private readonly wrap: HTMLElement, private readonly props: Namespace.Props) {
    this.fieldManager = pipe(FieldManager, H.instance(wrap));
    this.dropdownManager = pipe(DropdownManager, H.instance(wrap));
    this.datepickerManager = pipe(DatepickerManager, H.instance(wrap, {
      name: props.name,
      selected: props.selected,
      autoApply: props.autoApply,
      onSelect: this.handleSelect,
      onSelectionEnd: this.handleSelectionEnd
    }));
  }

  private readonly dropdownManager: InstanceType<typeof DropdownManager>;
  private readonly datepickerManager: InstanceType<typeof DatepickerManager>;
  private readonly fieldManager: InstanceType<typeof FieldManager>;

  private readonly handleSelect = (data: Record<string, Option<[Date, Date]>>) => {
    pipe(data, R.map(this.fieldManager.updateValue));
    this.props.onChange(data);
  };

  private readonly handleSelectionEnd = () => {
    this.dropdownManager.setExpanded(false);
  }
}

export default DateDropdown;