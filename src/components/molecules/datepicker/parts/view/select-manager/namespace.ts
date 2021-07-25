namespace SelectManager {
  export interface Props {
    selectionType: 'active' | 'inactive',
    dates: Array<Date>,
    onSelectionMove: (date: Date) => void,
    onSelectionStart: (date: Date) => void,
    onSelectionEnd: (date: Date) => void
  }
}

export default SelectManager;