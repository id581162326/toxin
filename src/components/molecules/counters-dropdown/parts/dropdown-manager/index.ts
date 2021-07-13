import {flow, pipe} from 'fp-ts/function';
import * as O from 'fp-ts/Option';
import * as H from 'globals/helpers';
import * as A from 'fp-ts/Array';

import Namespace from './namespace';

class DropdownManager implements Namespace.Interface {
  public readonly setExpanded = (expanded: boolean) => {
    pipe(this.root, O.map(pipe(['counters-dropdown_expanded'], expanded ? H.addClassList : H.removeClassList)));
    pipe(this.button, O.map(H.setAttribute('aria-expanded', H.toString(expanded))));

    return (this);
  };

  constructor(private readonly container: HTMLElement) {
    this.initButton();
    this.initFocusTrap();
    this.initEscapeKeyPress();
    this.setOutsideClickSideEffect();
  }

  private readonly root = pipe(this.container, H.querySelector<HTMLDivElement>('.js-counters-dropdown'));

  private readonly button = pipe(this.container, H.querySelector<HTMLInputElement>('.js-counters-dropdown__input'));

  private readonly focusable = pipe(this.container, H.querySelectorAll<HTMLElement>('input, button:not([tabindex="0"])'));

  private readonly initButton = () => pipe(this.button, O.map(flow(H.addEventListener('click', this.toggleExpanded))));

  private readonly initFocusTrap = () => pipe(this.focusable, A.last, O.map(H.addEventListener('blur', this.handleLastBlur)));

  private readonly initEscapeKeyPress = () => pipe(this.focusable, A.map(H.addEventListener('keyup', this.handleEscapePress)));

  private readonly setOutsideClickSideEffect = () => pipe(document, H.addEventListener('click', this.handleOutsideClick));

  private readonly toggleExpanded = () => pipe(this.root, O.map((root) => pipe(!root.classList.contains('counters-dropdown_expanded'), this.setExpanded)));

  private readonly handleLastBlur = () => pipe(this.focusable, A.head, O.map(H.method('focus')));

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