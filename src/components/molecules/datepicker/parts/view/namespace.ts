namespace View {
  export interface Day {
    selected: boolean,
    isSibling: boolean,
    isStart: boolean,
    isEnd: boolean,
    isToday: boolean,
    disabled: boolean,
    date: Date
  }

  export interface CalendarData {
    month: number,
    year: number,
    calendar: Array<Array<Day>>
  }

  export type SelectionType = 'active' | 'inactive';

  export type DateRange = {
    startDate: Date | null,
    endDate: Date | null
  }

  export interface Props {
    onTurnNext: () => void,
    onTurnPrev: () => void,
    onSelect: (dates: [Date, Date]) => void,
    onSelectionEnd: () => void
  }

  export interface Interface {
    update: (calendarData: CalendarData) => this
  }
}

export default View;