namespace ExpandableCheckboxes {
  export type CheckboxesData = Record<string, boolean>;

  export interface Props {
    onChange: (checkboxesData: CheckboxesData) => void
  }

  export interface Interface {
    setExpanded: (expanded: boolean) => this
  }
}

export default ExpandableCheckboxes;