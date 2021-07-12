import {flow, pipe} from 'fp-ts/function';
import * as O from 'fp-ts/Option';
import * as H from 'globals/helpers';

import Namespace from './namespace';

class DropdownManager implements Namespace.Interface {
  public readonly setExpanded = (expanded: boolean) => {
    pipe(this.root, O.map(pipe(['counters-dropdown_expanded'], expanded ? H.addClassList : H.removeClassList)));

    return (this);
  };

  constructor(private readonly container: HTMLElement) {
    this.initDropdown();
    this.setOutsideClick();
  }

  private readonly root = pipe(this.container, H.querySelector<HTMLDivElement>('.js-counters-dropdown'));

  private readonly button = pipe(this.container, H.querySelector<HTMLInputElement>('.js-counters-dropdown__input'));

  private readonly initDropdown = () => pipe(this.button, O.map(flow(H.addEventListener('click', this.toggleExpanded))));

  private readonly setOutsideClick = () => pipe(document, H.addEventListener('click', this.handleOutsideClick));

  private readonly toggleExpanded = () => pipe(this.root, O.map((root) => pipe(!root.classList.contains('counters-dropdown_expanded'), this.setExpanded)));

  private readonly handleOutsideClick = ({target}: MouseEvent) => pipe(
    this.root, O.map((root) => !root.contains(target as Node) ? this.setExpanded(false) : {})
  );
}

export default DropdownManager;