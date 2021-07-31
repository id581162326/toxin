import {Plural} from 'globals/utils'

namespace FieldManager {
  export type CountersData = Array<{ value: number, plural: Plural }>;

  export interface Interface {
    updateValue: (countersData: CountersData) => this
  }
}

export default FieldManager;