import {Option} from 'fp-ts/Option';

namespace Datepicker {
  export interface Props {
    onSelect: (dates: Option<[Date, Date]>) => void,
    onSelectionEnd: () => void,
    selected?: [Date, Date]
  }

  export interface Interface {
    reset: () => this
  }
}

export default Datepicker;