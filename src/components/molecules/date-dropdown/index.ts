import {pipe} from 'fp-ts/function';
import * as H from 'globals/helpers';

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
      selected: props.selected,
      autoApply: props.autoApply,
      onSelect: this.handleSelect,
      onSelectionEnd: this.handleSelectionEnd
    }));
  }

  private readonly dropdownManager: InstanceType<typeof DropdownManager>;
  private readonly datepickerManager: InstanceType<typeof DatepickerManager>;
  private readonly fieldManager: InstanceType<typeof FieldManager>;

  private readonly handleSelect = (dates?: [Date, Date]) => {
    this.fieldManager.updateValue(dates);
    this.props.onChange(dates);
  };

  private readonly handleSelectionEnd = () => {
    this.dropdownManager.setExpanded(false);
  }
}

export default DateDropdown;