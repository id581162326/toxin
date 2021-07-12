namespace CountersDropdown {
  export type CountersData = Record<string, {
    value: number,
    plurals: {one: string, few: string, many: string}
  }>;

  export interface Props {
    onChange?: (countersData: CountersData) => void
  }
}

export default CountersDropdown;