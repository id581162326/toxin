import {Plural} from 'globals/utils'

namespace FieldManager {
  export type CountersData = Array<{ value: number, plural: Plural }>;

  export interface Interface {
    setDisabled: (disabled: boolean) => this,
    updateValue: (countersData: CountersData) => this
  }
}

export default FieldManager;