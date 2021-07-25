namespace Datepicker {
  export interface Props {
    onSelect: (dates?: [Date, Date]) => void,
    onSelectionEnd: () => void,
    selected?: [Date, Date]
  }

  export interface Interface {
    reset: () => this
  }
}

export default Datepicker;