import CountersManager from './parts/counters-manager/namespace';

namespace CountersDropdown {
  export type CountersData = CountersManager.CountersData

  export interface Props {
    onChange?: (countersData: Record<string, number>) => void
  }

  export interface Interface {
    setDisabled: (disabled: boolean) => this,
    setExpanded: (expanded: boolean) => this
  }
}

export default CountersDropdown;