import {flow, pipe} from 'fp-ts/function';
import * as H from 'globals/helpers';
import * as O from 'fp-ts/Option';

import CheckboxGroup from 'molecules/checkbox-group';

import Namespace from './namespace';

class ExpandableCheckboxes implements Namespace.Interface {
  public readonly setExpanded = (expanded: boolean) => {
    pipe(this.root, O.map(pipe(['expandable-checkboxes_expanded'], expanded ? H.addClassList : H.removeClassList)));
    pipe(this.button, O.map(H.setAttribute('aria-expanded', H.toString(expanded))));

    return (this);
  };

  constructor(private readonly wrap: HTMLElement, private readonly props: Namespace.Props) {
    this.initButton();
    this.initCheckboxGroup();
  }

  private readonly root = pipe(this.wrap, H.querySelector<HTMLDivElement>('.js-expandable-checkboxes'));
  private readonly button = pipe(this.wrap, H.querySelector<HTMLButtonElement>('.js-expandable-checkboxes__button'));
  private readonly groupWrap = pipe(this.wrap, H.querySelector<HTMLDivElement>('.js-expandable-checkboxes__group'));

  private readonly initButton = () => pipe(this.button, O.map(H.addEventListener('click', this.toggleExpanded)));

  private readonly initCheckboxGroup = () => pipe(this.groupWrap, O.map((wrap) => pipe(
    CheckboxGroup, H.instance(wrap, {
      onChange: this.props.onChange
    }))
  ));

  private readonly toggleExpanded = () => pipe(this.root, O.map(flow(
    H.containsClass('expandable-checkboxes_expanded'), H.not, this.setExpanded
  )));
}

export default ExpandableCheckboxes;