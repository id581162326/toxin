import {NonEmptyArray} from 'fp-ts/NonEmptyArray';

namespace Model {
  export interface Day {
    selected: boolean,
    disabled: boolean,
    isSibling: boolean,
    isStart: boolean,
    isEnd: boolean,
    isToday: boolean,
    date: Date
  }

  export interface CalendarData {
    year: number,
    month: number,
    calendar: Array<NonEmptyArray<Day>>
  }

  export interface Props {
    selected?: [Date, Date],
    onSelect: (dates?: [Date, Date]) => void
  }

  export interface State {
    year: number,
    month: number,
    selected?: [Date, Date]
  }

  export interface Listener {
    update: (calendarData: CalendarData) => any
  }

  export interface Interface {
    attachListener: (listener: Listener) => this,
    turnToNext: () => this,
    turnToPrev: () => this,
    setSelected: (dates: [Date, Date]) => this,
    resetSelected: () => this
  }
}

export default Model;