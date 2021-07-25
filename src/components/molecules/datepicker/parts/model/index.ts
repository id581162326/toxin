import * as A from 'fp-ts/Array';
import * as D from 'fp-ts/Date';
import * as F from 'fp-ts/function';
import {pipe} from 'fp-ts/function';
import * as O from 'fp-ts/Option';
import * as H from 'globals/helpers';
import {today} from 'globals/utils';

import Namespace from './namespace';
import {Ordering} from 'fp-ts/Ordering';

class Model implements Namespace.Interface {
  public readonly turnToNext = () => {
    const month = this.state.month + 1;
    const year = this.state.year;

    this.updateState({month: month > 11 ? 0 : month, year: month > 11 ? year + 1 : year});

    return (this);
  };

  public readonly turnToPrev = () => {
    const month = this.state.month - 1;
    const year = this.state.year;

    this.updateState({month: month < 0 ? 11 : month, year: month < 0 ? year - 1 : year});

    return (this);
  };

  public readonly resetSelected = () => {
    this.updateState({selected: undefined});

    this.props.onSelect(this.state.selected);

    return (this);
  };

  public readonly setSelected = (selected: [Date, Date]) => {
    this.updateState({selected: pipe(selected, A.map(this.normalizeSelected), A.sort(D.Ord)) as [Date, Date]});

    this.props.onSelect(this.state.selected);

    return (this);
  };

  public readonly attachListener = (listener: Namespace.Listener) => {
    this.listeners.push(listener);

    this.updateListeners();

    return (this);
  };

  constructor(private readonly props: Namespace.Props) {
    pipe(props.selected, O.fromNullable, O.map(this.setSelected));
  }

  private readonly listeners: Array<Namespace.Listener> = [];

  private state: Namespace.State = {
    year: new Date().getFullYear(),
    month: new Date().getMonth(),
    selected: this.props.selected
  };

  private readonly updateState = (state: Partial<Namespace.State>) => {
    this.state = {...this.state, ...state};
    this.updateListeners();
  };

  private readonly updateListeners = () => pipe(this.listeners, A.map(H.method('update', {
    ...this.state,
    calendar: this.getCalendar()
  })));

  private readonly compareDates = (...orderings: Array<Ordering>) => (x: Date) => (y: Date) => {
    const comparison = H.compare(D.Ord)(x)(y);

    return (pipe(orderings, A.reduce(false, (acc, ordering) => acc || comparison === ordering)))
  };

  private readonly dateGte = this.compareDates(1, 0);

  private readonly dateLte = this.compareDates(-1, 0);

  private readonly dateLt = this.compareDates(-1);

  private readonly dateInRange = (date: Date) => pipe(
    this.state.selected, O.fromNullable, O.map(([startDate, endDate]) => pipe(true, H.switchCases([
      [this.dateGte(startDate)(date) && this.dateLte(endDate)(date), F.constTrue]
    ], F.constFalse))), O.getOrElse(F.constFalse)
  );

  private readonly datesAreEquals = H.equals(D.Eq);

  private readonly dateIsStart = (date: Date) => pipe(this.state.selected, O.fromNullable, O.map(
    ([startDate, _]) => this.datesAreEquals(startDate, date)), O.getOrElse(F.constFalse));

  private readonly dateIsEnd = (date: Date) => pipe(this.state.selected, O.fromNullable, O.map(
    ([_, endDate]) => this.datesAreEquals(endDate, date)), O.getOrElse(F.constFalse));

  private readonly normalizeSelected = (date: Date) => this.dateLt(today)(date) ? today : date;

  private readonly dateIsDisabled = this.dateLt(today);

  public readonly getCalendar = () => {
    const {year, month} = this.state;

    const daysInMonth = new Date(year, month, 0).getDate();
    const firstWeekDay = new Date(year, month, 0).getDay();
    const lastWeekDay = new Date(year, month, daysInMonth).getDay();
    const daysInCalendar = daysInMonth + firstWeekDay + (7 - lastWeekDay);

    return pipe(
      A.makeBy(daysInCalendar, (day): Namespace.Day => {
        const date = new Date(year, month, (day + 1) - firstWeekDay, 0, 0, 0, 0);

        return ({
          date,
          disabled: this.dateIsDisabled(date),
          isSibling: date.getMonth() !== month,
          isToday: this.datesAreEquals(date, today),
          isStart: this.dateIsStart(date),
          isEnd: this.dateIsEnd(date),
          selected: this.dateInRange(date)
        });
      }),
      A.chunksOf(7)
    );
  };
}

export default Model;