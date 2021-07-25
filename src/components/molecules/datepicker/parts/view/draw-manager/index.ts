import {pipe} from 'fp-ts/function';
import * as H from 'globals/helpers';
import * as O from 'fp-ts/Option';
import {monthNames} from 'globals/utils';
import * as A from 'fp-ts/Array';

import Namespace from './namespace';
import template from './template.njk';

class DrawManager implements Namespace.Interface {
  public readonly renderWith = (year: number, month: number, calendar: Array<Array<Namespace.Day>>) => {
    this.year !== year || this.month !== month ? this.reDraw(year, month, calendar) : this.actualizeCells(calendar);

    return (this);
  };

  constructor(private readonly wrap: HTMLElement, private readonly props: Namespace.Props) {
  }

  private year: number | undefined;
  private month: number | undefined;

  private cells: Array<HTMLDivElement> = [];
  private readonly gridWrap = pipe(this.wrap, H.querySelector<HTMLDivElement>('.js-datepicker__grid'));
  private readonly headingWrap = pipe(this.wrap, H.querySelector<HTMLSpanElement>('.js-datepicker__heading'));

  private readonly reDraw = (year: number, month: number, calendar: Array<Array<Namespace.Day>>) => pipe(this.gridWrap, O.map(
    (wrap) => {
      wrap.innerHTML = template({
        calendar: pipe(calendar, A.map(A.map((data) => ({
          ...data,
          date: data.date.getDate()
        }))))
      });

      pipe(this.headingWrap, O.map(H.setInnerText(`${monthNames[month]} ${year}`)));

      this.year = year;
      this.month = month;
      this.cells = pipe(wrap, H.querySelectorAll<HTMLDivElement>('.js-datepicker__cell'));

      this.props.onDraw(calendar);
    })
  );

  private readonly actualizeCells = (calendar: Array<Array<Namespace.Day>>) => pipe(
    calendar, A.flatten, A.zip(this.cells), A.map((this.setCellData))
  );

  private readonly setCellData = ([{selected, isEnd, isStart}, cell]: [Namespace.Day, HTMLDivElement]) => pipe(
    cell,
    pipe(['datepicker__cell_selected'], selected ? H.addClassList : H.removeClassList),
    pipe(['datepicker__cell_is_end'], isEnd ? H.addClassList : H.removeClassList),
    pipe(['datepicker__cell_is_start'], isStart ? H.addClassList : H.removeClassList),
    pipe('selected', selected ? H.setAttribute : H.removeAttribute)
  );
}

export default DrawManager;