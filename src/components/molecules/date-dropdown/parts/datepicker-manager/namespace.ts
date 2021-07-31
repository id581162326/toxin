import {Option} from 'fp-ts/Option';

namespace DatepickerManager {
  export interface Props {
    onSelect: (dates: Option<[Date, Date]>) => void,
    onSelectionEnd: () => void,
    selected?: [Date, Date],
    autoApply?: true
  }
}

export default DatepickerManager;