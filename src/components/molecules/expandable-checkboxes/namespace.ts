namespace ExpandableCheckboxes {
  export interface Props {
    onChange: (checkboxesData: Record<string, boolean>) => void
  }

  export interface Interface {
    setExpanded: (expanded: boolean) => this
  }
}

export default ExpandableCheckboxes;