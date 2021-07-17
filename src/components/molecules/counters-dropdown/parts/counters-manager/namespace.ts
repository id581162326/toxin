import {Plural} from 'globals/utils';

namespace CountersDropdown {
  export type CountersData = Record<string, {
    value: number,
    plural: Plural,
    min: number
  }>;

  export interface Counter {
    label: string,
    name: string,
    value: number,
    plural: Plural,
    min?: number,
    max?: number
  }

  export interface Props {
    counters: Array<Counter>,
    onChange: (countersData: CountersData) => void,
    autoApply?: true
  }
}

export default CountersDropdown;