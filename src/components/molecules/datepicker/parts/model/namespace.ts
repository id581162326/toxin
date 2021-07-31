import {NonEmptyArray} from 'fp-ts/NonEmptyArray';
import {Option} from 'fp-ts/Option';

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
    onSelect: (dates: Option<[Date, Date]>) => void,
    selected?: [Date, Date]
  }

  export interface State {
    year: number,
    month: number,
    selected: Option<[Date, Date]>
  }

  export interface Listener {
    update: (calendarData: CalendarData) => any
  }

  export interface Interface {
    attachListener: (listener: Listener) => this,
    turnToNext: () => this,
    turnToPrev: () => this,
    setSelected: (dates: Option<[Date, Date]>) => this
  }
}

export default Model;