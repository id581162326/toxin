import {Option} from 'fp-ts/Option';

namespace Datepicker {
  export interface Props {
    name: string,
    onSelect: (dates: Record<string, Option<[Date, Date]>>) => void,
    onSelectionEnd: () => void,
    selected?: [Date, Date]
  }

  export interface Interface {
    reset: () => this
  }
}

export default Datepicker;