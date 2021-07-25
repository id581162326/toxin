import * as F from 'fp-ts/function';
import {flow, pipe} from 'fp-ts/function';
import * as O from 'fp-ts/Option';
import * as H from 'globals/helpers';
import * as A from 'fp-ts/Array';

class KeyboardNavigation {
  constructor(private readonly wrap: HTMLElement) {
    this.initKeyboardNavigation();
  }

  private readonly gridWrap = pipe(this.wrap, H.querySelector<HTMLDivElement>('.js-datepicker__grid'));
  private readonly cells = pipe(this.wrap, H.querySelectorAll<HTMLDivElement>('.js-datepicker__cell'));

  private readonly hasArrowCode = (event: KeyboardEvent) => event.code === 'ArrowUp'
    || event.code === 'ArrowDown' || event.code === 'ArrowLeft' || event.code === 'ArrowRight';

  private readonly initKeyboardNavigation = () => {
    pipe(this.gridWrap, O.map(H.addEventListener('keydown', this.handleGridNav)));
    pipe(this.cells, A.mapWithIndex((idx, cell) => H.addEventListener('keydown', this.handleCellNav(idx))(cell)));
  };

  private readonly focusCellWithOffset = (idx: number, offset: number) => {
    pipe(this.cells, A.lookup(idx + offset), O.map((cell) => pipe(
      cell, H.containsClass('datepicker__cell_disabled'), H.switchCases([
        [false, () => cell.focus()]
      ], F.constVoid)
    )));
  };

  private readonly handleGridNav = (event: KeyboardEvent) => {
    if (this.hasArrowCode(event)) {
      event.preventDefault();

      pipe(this.cells, A.findFirst(flow(H.containsClass('datepicker__cell_disabled'), H.not)), O.map(H.method('focus')));
    }
  };

  private readonly handleCellNav = (idx: number) => (event: KeyboardEvent) => {
    if (this.hasArrowCode(event) || event.code === 'Tab') {
      event.preventDefault();
      event.stopPropagation();

      pipe(event.code, H.switchCases([
        ['ArrowUp', () => this.focusCellWithOffset(idx, -7)],
        ['ArrowDown', () => this.focusCellWithOffset(idx, 7)],
        ['ArrowLeft', () => this.focusCellWithOffset(idx, -1)],
        ['ArrowRight', () => this.focusCellWithOffset(idx, 1)],
        ['Tab', () => pipe(this.gridWrap, O.map(H.method('focus')))]
      ], F.constVoid));
    }
  };
}

export default KeyboardNavigation;