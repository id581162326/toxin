namespace DatepickerManager {
  export interface Props {
    selected?: [Date, Date],
    onSelect: (dates?: [Date, Date]) => void,
    onSelectionEnd: () => void,
    autoApply?: true
  }
}

export default DatepickerManager;