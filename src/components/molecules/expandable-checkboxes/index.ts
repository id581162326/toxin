import {pipe} from 'fp-ts/function';
import * as H from 'globals/helpers';

import CheckboxGroup from 'molecules/checkbox-group';

import Namespace from './namespace';
import * as O from 'fp-ts/Option';

class ExpandableCheckboxes implements Namespace.Interface {
  public readonly setExpanded = (expanded: boolean) => {
    pipe(this.root, O.map(pipe(['expandable-checkboxes_expanded'], expanded ? H.addClassList : H.removeClassList)));
    pipe(this.button, O.map(H.setAttribute('aria-expanded', H.toString(expanded))));

    return (this)
  }

  constructor(private readonly container: HTMLElement, private readonly props: Namespace.Props) {
    this.initButton();
    this.initCheckboxGroup();
  }

  private readonly root = pipe(this.container, H.querySelector<HTMLDivElement>('.js-expandable-checkboxes'));

  private readonly button = pipe(this.container, H.querySelector<HTMLButtonElement>('.js-expandable-checkboxes__button'));

  private readonly group = pipe(this.container, H.querySelector<HTMLDivElement>('.js-expandable-checkboxes__group'))

  private readonly initButton = () => pipe(this.button, O.map(H.addEventListener('click', this.toggleExpanded)));

  private readonly initCheckboxGroup = () => pipe(this.group, O.map((group) => pipe(CheckboxGroup, H.instance(group, {onChange: this.props.onChange}))))

  private readonly toggleExpanded = () => pipe(this.root, O.map((root) => pipe(!root.classList.contains('expandable-checkboxes_expanded'), this.setExpanded)));
}

export default ExpandableCheckboxes;