import {pipe} from 'fp-ts/function';
import * as H from 'globals/helpers';
import * as A from 'fp-ts/Array';
import * as O from 'fp-ts/Option'

import Button from 'atoms/button';

import Namespace from './namespace';
import KeyboardNavigation from './keyboard-navigation';
import DrawManager from './draw-manager';
import SelectManager from './select-manager';

class View implements Namespace.Interface {
  public readonly update = ({year, month, calendar}: Namespace.CalendarData) => {
    this.drawManager.renderWith(year, month, calendar);

    return (this);
  };

  constructor(private readonly wrap: HTMLElement, private readonly props: Namespace.Props) {
    this.drawManager = pipe(DrawManager, H.instance(this.wrap, {onDraw: this.initCalendar}));

    this.initPrevBtn();
    this.initNextBtn();
  }

  private readonly prevBtnWrap = pipe(this.wrap, H.querySelector<HTMLDivElement>('.js-datepicker__prev-btn'));
  private readonly nextBtnWrap = pipe(this.wrap, H.querySelector<HTMLDivElement>('.js-datepicker__next-btn'));

  private selectionType: Namespace.SelectionType = 'inactive';

  private firstSelectedDate: Date = new Date();

  private readonly drawManager: InstanceType<typeof DrawManager>;

  private readonly initCalendar = (calendar: Namespace.CalendarData['calendar']) => {
    this.initSelectManager(this.selectionType, calendar);
    this.initKeyboardNavigation();
  }

  private readonly initSelectManager = (selectionType: Namespace.SelectionType, calendar: Namespace.CalendarData['calendar']) => pipe(
    SelectManager, H.instance(
      this.wrap, {
        selectionType,
        dates: pipe(calendar, A.flatten, A.map(H.prop('date'))),
        onSelectionStart: this.handleSelectionStart,
        onSelectionEnd: this.handleSelectionEnd,
        onSelectionMove: this.handleSelectionMove
      }
    )
  );

  private readonly initKeyboardNavigation = () => pipe(KeyboardNavigation, H.instance(this.wrap));

  private readonly initPrevBtn = () => pipe(this.prevBtnWrap, O.map((wrap) => pipe(
    Button, H.instance(wrap, {onClick: this.handleTurnPrev})
  )));

  private readonly initNextBtn = () => pipe(this.nextBtnWrap, O.map((wrap) => pipe(
    Button, H.instance(wrap, {onClick: this.handleTurnNext})
  )));

  private readonly handleTurnNext = () => {
    this.props.onTurnNext();
  };

  private readonly handleTurnPrev = () => {
    this.props.onTurnPrev();
  };

  private readonly handleSelectionStart = (date: Date) => {
    this.selectionType = 'active';

    this.firstSelectedDate = date;

    this.props.onSelect([date, date]);
  };

  private readonly handleSelectionEnd = (date: Date) => {
    this.selectionType = 'inactive';

    this.props.onSelect([this.firstSelectedDate, date]);
    this.props.onSelectionEnd();
  };

  private readonly handleSelectionMove = (date: Date) => {
    this.props.onSelect([this.firstSelectedDate, date]);
  };
}


export default View;