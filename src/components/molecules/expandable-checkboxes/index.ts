import {flow, pipe} from 'fp-ts/function';
import * as H from 'globals/helpers';
import * as O from 'fp-ts/Option';

import CheckboxGroup from 'molecules/checkbox-group';

import Namespace from './namespace';

class ExpandableCheckboxes extends CheckboxGroup implements Namespace.Interface {
  public readonly setExpanded = (expanded: boolean) => {
    pipe(this.root, O.map(pipe(['expandable-checkboxes_expanded'], expanded ? H.addClassList : H.removeClassList)));
    pipe(this.button, O.map(H.setAttribute('aria-expanded', H.toString(expanded))));

    return (this);
  };

  constructor(wrap: HTMLElement, props: Namespace.Props) {
    super(wrap, props)
    this.initButton();
  }

  private readonly root = pipe(this.wrap, H.querySelector<HTMLDivElement>('.js-expandable-checkboxes'));
  private readonly button = pipe(this.wrap, H.querySelector<HTMLButtonElement>('.js-expandable-checkboxes__button'));

  private readonly initButton = () => pipe(this.button, O.map(H.addEventListener('click', this.toggleExpanded)));

  private readonly toggleExpanded = () => pipe(this.root, O.map(flow(
    H.containsClass('expandable-checkboxes_expanded'), H.not, this.setExpanded
  )));
}

export default ExpandableCheckboxes;