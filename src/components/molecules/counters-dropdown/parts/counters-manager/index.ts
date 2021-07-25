import {pipe} from 'fp-ts/function';
import * as O from 'fp-ts/Option';
import {Option} from 'fp-ts/Option';
import * as H from 'globals/helpers';
import * as A from 'fp-ts/Array';
import * as R from 'fp-ts/Record';

import Counter from 'atoms/counter';
import Button from 'atoms/button';

import Namespace from './namespace';
import template from './template.njk';

class CountersManager {
  constructor(private readonly wrap: HTMLElement, private readonly props: Namespace.Props) {
    this.renderContent();

    this.applyBtnWrap = pipe(wrap, H.querySelector<HTMLDivElement>('.js-counters-dropdown__apply-btn'));
    this.clearBtnWrap = pipe(wrap, H.querySelector<HTMLDivElement>('.js-counters-dropdown__clear-btn'));
    this.items = pipe(wrap, H.querySelectorAll<HTMLLIElement>('.js-counters-dropdown__item'));
    this.counters = this.initCounters();

    this.initApplyBtn();
    this.initClearBtn();
    this.sendCountersData();
    this.setClearBtnVisibility();
  }

  private countersData: Namespace.CountersData = pipe(
    this.props.counters,
    A.reduce({}, (acc, {name, value, min, plural}) => ({...acc, ...{[name]: {value, plural, min: min ? min : 0}}}))
  );

  private readonly counters: Array<InstanceType<typeof Counter>>;

  private readonly listWrap = pipe(this.wrap, H.querySelector<HTMLDivElement>('.js-counters-dropdown__list-wrap'));
  private readonly items: Array<HTMLLIElement>;
  private readonly applyBtnWrap: Option<HTMLDivElement>;
  private readonly clearBtnWrap: Option<HTMLDivElement>;

  private readonly renderContent = () => pipe(this.listWrap, O.map((listWrap) => {
    listWrap.insertAdjacentHTML('afterbegin', template(this.props));
  }));

  private readonly initCounters = () => pipe(this.items, A.map((item) => pipe(
    Counter, H.instance(item, {onChange: this.handleCounterChange}))
  ));

  private readonly initApplyBtn = () => pipe(this.applyBtnWrap, O.map(
    (wrap) => pipe(Button, H.instance(wrap, {onClick: this.handleApply}))
  ));

  private readonly initClearBtn = () => pipe(this.clearBtnWrap, O.map(
    (wrap) => pipe(Button, H.instance(wrap, {onClick: this.resetCountersData}))
  ));

  private readonly sendCountersData = () => this.props.onChange(this.countersData);

  private readonly setCountersData = (data: Record<string, number>) => pipe(data, R.keys, A.head, O.map((name) => {
    this.countersData = {...this.countersData, [name]: {...this.countersData[name], value: data[name]}};
  }));

  private readonly resetCountersData = () => {
    pipe(this.counters, A.map(H.method('reset')));

    this.sendCountersData();
  };

  private readonly setClearBtnVisibility = () => {
    const isHidden = pipe(this.countersData, H.values, A.map(({value, min}) => pipe(
      value, H.sub(min), Boolean)
    ), H.includes(true), H.not);

    pipe(this.clearBtnWrap, O.map(pipe(['counters-dropdown__control-btn_is_hidden'], isHidden
      ? H.addClassList : H.removeClassList)));
  };

  private readonly handleCounterChange = (data: Record<string, number>) => {
    this.setCountersData(data);

    if (document.readyState === 'complete' && this.props.autoApply) {
      this.sendCountersData();
      return;
    }

    this.setClearBtnVisibility();
  };

  private readonly handleApply = () => {
    this.sendCountersData();
    this.props.onApply();
  }
}

export default CountersManager;