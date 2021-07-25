namespace DateDropdown {
  export interface Props {
    onChange: (dates?: [Date, Date]) => void,
    selected?: [Date, Date],
    autoApply?: true
  }

  export interface Interface {
    setDisabled: (disabled: boolean) => this,
    setExpanded: (expanded: boolean) => this
  }
}

export default DateDropdown;