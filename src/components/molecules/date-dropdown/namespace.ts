import {Option} from 'fp-ts/Option';

namespace DateDropdown {
  export interface Props {
    name: string,
    onChange: (dates: Record<string, Option<[Date, Date]>>) => void,
    selected?: [Date, Date],
    autoApply?: true
  }

  export interface Interface {
    setDisabled: (disabled: boolean) => this,
    setExpanded: (expanded: boolean) => this
  }
}

export default DateDropdown;