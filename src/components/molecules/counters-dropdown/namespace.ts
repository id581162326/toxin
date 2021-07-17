import CountersManager from './parts/counters-manager/namespace';

namespace CountersDropdown {
  export type CountersData = CountersManager.CountersData;

  export type Counter = CountersManager.Counter;

  export interface Props {
    counters: Array<Counter>,
    onChange: (countersData: Record<string, number>) => void,
    autoApply?: true
  }

  export interface Interface {
    setDisabled: (disabled: boolean) => this,
    setExpanded: (expanded: boolean) => this
  }
}

export default CountersDropdown;