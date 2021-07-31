import {Option} from 'fp-ts/Option';

namespace FieldManager {
  export interface Interface {
    setDisabled: (disabled: boolean) => this,
    updateValue: (dates: Option<[Date, Date]>) => this
  }
}

export default FieldManager;