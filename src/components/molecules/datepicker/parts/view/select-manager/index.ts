import * as F from 'fp-ts/function';
import {pipe} from 'fp-ts/function';
import * as A from 'fp-ts/Array';
import * as H from 'globals/helpers';
import * as O from 'fp-ts/Option';

import Namespace from './namespace';

class SelectManager {
  constructor(private readonly wrap: HTMLElement, private readonly props: Namespace.Props) {
    this.initCells();
  }

  private selectionType: Namespace.Props['selectionType'] = this.props.selectionType;
  private lastSelected: Date = new Date();

  private readonly gridWrap = pipe(this.wrap, H.querySelector<HTMLDivElement>('.js-datepicker__grid'));
  private readonly cells = pipe(this.wrap, H.querySelectorAll<HTMLDivElement>('.js-datepicker__cell'));

  private readonly initCells = () => pipe(
    this.cells, A.zip(this.props.dates),
    A.map((data) => this.initEventListeners(...data))
  );

  private readonly initEventListeners = (cell: HTMLDivElement, date: Date) => pipe(
    cell,
    H.addEventListener('click', this.handleClick(date)),
    H.addEventListener('keyup', this.handleKeyUp(date)),
    H.addEventListener('mouseover', this.handleHover(date)),
    H.addEventListener('focus', this.handleHover(date))
  );

  private readonly handleOutsideClick = ({target}: MouseEvent) => pipe(this.gridWrap, O.map((wrap) =>
    !wrap.contains(target as Node) ? this.endSelection(this.lastSelected) : {}
  ))

  private readonly selectDate = (date: Date) => pipe(this.selectionType, H.switchCases([
    ['active', () => this.endSelection(date)],
    ['inactive', () => this.startSelection(date)]
  ], F.constVoid));

  private readonly startSelection = (date: Date) => {
    this.selectionType = 'active';
    pipe(document, H.addEventListener('click', this.handleOutsideClick));
    this.props.onSelectionStart(date);
  };

  private readonly endSelection = (date: Date) => {
    this.selectionType = 'inactive';
    pipe(document, H.removeEventListener('click', this.handleOutsideClick));
    pipe(this.gridWrap, O.map(H.method('focus')));
    this.props.onSelectionEnd(date);
  }

  private readonly handleClick = (date: Date) => () => {
    this.selectDate(date);
  };

  private readonly handleKeyUp = (date: Date) => (event: KeyboardEvent) => {
    if (event.code === 'Space' || event.code === 'Enter' || event.code === 'Tab') {
      event.preventDefault();
      this.selectDate(date);
    }
  };

  private readonly handleHover = (date: Date) => () => {
    if (this.selectionType === 'active') {
      this.lastSelected = date;
      this.props.onSelectionMove(date);
    }
  };
}

export default SelectManager;