namespace DrawManager {
  export interface Day {
    selected: boolean,
    isSibling: boolean,
    isStart: boolean,
    isEnd: boolean,
    isToday: boolean,
    disabled: boolean,
    date: Date
  }

  export interface Props {
    onDraw: (calendar: Array<Array<Day>>) => void
  }

  export interface Interface {
    renderWith: (year: number, month: number, calendar: Array<Array<Day>>) => this
  }
}

export default DrawManager;