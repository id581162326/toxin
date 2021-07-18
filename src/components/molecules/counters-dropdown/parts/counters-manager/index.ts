import * as F from 'fp-ts/function';
import {pipe} from 'fp-ts/function';
import * as O from 'fp-ts/Option';
import {Option} from 'fp-ts/Option';
import * as H from 'globals/helpers';
import * as A from 'fp-ts/Array';
import * as R from 'fp-ts/Record';

import Counter from 'atoms/counter';
import Button from 'atoms/button';

import Namespace from './namespace';
import listTemplate from './templates/list.njk';
import controlsTemplate from './templates/controls.njk';

class CountersManager {
  constructor(private readonly container: HTMLElement, private readonly props: Namespace.Props) {
    this.renderContent();
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

  private readonly listWrap = pipe(this.container, H.querySelector<HTMLDivElement>('.js-counters-dropdown__list-wrap'));

  private readonly counters: Array<InstanceType<typeof Counter>>;

  private list: Array<HTMLLIElement> = [];

  private applyBtnContainer: Option<HTMLDivElement> = O.none;

  private clearBtnContainer: Option<HTMLDivElement> = O.none;

  private readonly renderContent = () => pipe(this.listWrap, O.map((listWrap) => {
    const {counters, autoApply} = this.props;

    const listHTML = listTemplate({counters});

    const controlsHTML = !autoApply ? controlsTemplate() : '';

    listWrap.insertAdjacentHTML('afterbegin', listHTML + controlsHTML);

    this.list = pipe(listWrap, H.querySelectorAll<HTMLLIElement>('.js-counters-dropdown__item'));

    this.applyBtnContainer = pipe(listWrap, H.querySelector<HTMLDivElement>('.js-counters-dropdown__apply-btn'));

    this.clearBtnContainer = pipe(listWrap, H.querySelector<HTMLDivElement>('.js-counters-dropdown__clear-btn'));
  }));

  private readonly initCounters = () => pipe(this.list, A.map((item) => pipe(
    Counter, H.instance(item, {onChange: this.handleCounterChange}))
  ));

  private readonly initApplyBtn = () => pipe(this.applyBtnContainer, O.map(
    (btnContainer) => pipe(Button, H.instance(btnContainer, {onClick: this.sendCountersData}))
  ));

  private readonly initClearBtn = () => pipe(this.clearBtnContainer, O.map(
    (btnContainer) => pipe(Button, H.instance(btnContainer, {onClick: this.resetCountersData}))
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

    pipe(this.clearBtnContainer, O.map(pipe(['counters-dropdown__control-btn_is_hidden'], isHidden
      ? H.addClassList : H.removeClassList)));
  };

  private readonly handleCounterChange = (data: Record<string, number>) => {
    this.setCountersData(data);

    if (document.readyState === 'complete') {
      pipe(O.isNone(this.applyBtnContainer) || O.isNone(this.clearBtnContainer), H.switchCases([
        [true, this.sendCountersData], [false, this.setClearBtnVisibility]
      ], F.constVoid));
    }
  };
}

export default CountersManager;