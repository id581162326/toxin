namespace FieldManager {
  export type Plurals = {one: string, few: string, many: string};

  export type CountersData = Array<{
    value: number,
    plurals: Plurals
  }>;

  export interface Interface {
    setDisabled: (disabled: boolean) => this,
    updateValue: (countersData: CountersData) => this
  }
}

export default FieldManager;