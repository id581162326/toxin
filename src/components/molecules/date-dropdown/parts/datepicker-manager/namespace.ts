import {Option} from 'fp-ts/Option';

namespace DatepickerManager {
  export interface Props {
    name: string,
    onSelect: (dates: Record<string, Option<[Date, Date]>>) => void,
    onSelectionEnd: () => void,
    selected?: [Date, Date],
    autoApply?: true
  }
}

export default DatepickerManager;