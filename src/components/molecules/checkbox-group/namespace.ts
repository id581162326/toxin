namespace CheckboxGroup {
  export type CheckboxesData = Record<string, boolean>;

  export interface Props {
    onChange: (checkboxesData: CheckboxesData) => void
  }
}

export default CheckboxGroup;