import * as F from 'fp-ts/function';
import {flow, pipe} from 'fp-ts/function';
import * as O from 'fp-ts/Option';
import * as H from 'globals/helpers';
import * as A from 'fp-ts/Array';

import Namespace from './namespace';

class DropdownManager implements Namespace.Interface {
  public readonly setExpanded = (expanded: boolean) => {
    pipe(this.root, O.map(pipe(['counters-dropdown_expanded'], expanded ? H.addClassList : H.removeClassList)));
    pipe(this.button, O.map(H.setAttribute('aria-expanded', H.toString(expanded))));
    pipe([this.setOutsideClickSideEffect, this.setFocusTrapSideEffect], A.map(H.call(expanded ? 'add' : 'remove')));

    return (this);
  };

  constructor(private readonly container: HTMLElement) {
    this.initButton();
    this.initEscapeKeyPress();
  }

  private readonly root = pipe(this.container, H.querySelector<HTMLDivElement>('.js-counters-dropdown'));

  private readonly button = pipe(this.container, H.querySelector<HTMLInputElement>('.js-counters-dropdown__input'));

  private readonly focusable = pipe(this.container, H.querySelectorAll<HTMLElement>('input, button:not([tabindex="-1"])'));

  private readonly initButton = () => pipe(this.button, O.map(flow(H.addEventListener('click', this.toggleExpanded))));

  private readonly setFocusTrapSideEffect = (type: 'add' | 'remove') => pipe(type, H.switchCases([
    ['add', this.initFocusTrap], ['remove', this.removeFocusTrap]
  ], F.constVoid));

  private readonly initFocusTrap = () => {
    pipe(this.focusable, A.head, O.map(H.addEventListener('blur', this.handleHeadBlur)));
    pipe(this.focusable, A.last, O.map(H.addEventListener('blur', this.handleLastBlur)));
  };

  private readonly removeFocusTrap = () => {
    pipe(this.focusable, A.head, O.map(H.addEventListener('blur', this.handleHeadBlur)));
    pipe(this.focusable, A.last, O.map(H.addEventListener('blur', this.handleLastBlur)));
  };

  private readonly initEscapeKeyPress = () => pipe(this.focusable, A.map(H.addEventListener('keyup', this.handleEscapePress)));

  private readonly setOutsideClickSideEffect = (type: 'add' | 'remove') => pipe(type, H.switchCases([
    ['add', () => H.addEventListener('click', this.handleOutsideClick)(document)],
    ['remove', () => H.removeEventListener('click', this.handleOutsideClick)(document)]
  ], F.constVoid));

  private readonly toggleExpanded = () => pipe(this.root, O.map((root) => pipe(!root.classList.contains('counters-dropdown_expanded'), this.setExpanded)));

  private readonly handleHeadBlur = ({relatedTarget}: FocusEvent) => pipe(this.focusable, A.last, O.map(
    relatedTarget && !this.container.contains(relatedTarget as Node) ? H.method('focus') : H.ident
  ));

  private readonly handleLastBlur = ({relatedTarget}: FocusEvent) => pipe(this.focusable, A.head, O.map(
    relatedTarget && !this.container.contains(relatedTarget as Node) ? H.method('focus') : H.ident
  ));

  private readonly handleEscapePress = ({code}: KeyboardEvent) => {
    if (code === 'Escape') {
      this.setExpanded(false);

      pipe(this.button, O.map(H.method('focus')));
    }
  };

  private readonly handleOutsideClick = ({target}: MouseEvent) => pipe(
    this.root, O.map((root) => !root.contains(target as Node) ? this.setExpanded(false) : {})
  );
}

export default DropdownManager;