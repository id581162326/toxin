import {pipe} from 'fp-ts/function';
import * as O from 'fp-ts/Option';
import * as H from 'globals/helpers';
import * as A from 'fp-ts/Array';
import * as F from 'fp-ts/function';

import Counter from 'atoms/counter';
import Button from 'atoms/button';

import Namespace from './namespace';

class CountersManager {
  constructor(private readonly container: HTMLElement, private readonly props: Namespace.Props) {
    this.counters = this.initCounters();
    this.initApplyBtn();
    this.initClearBtn();
    this.sendCountersData();
    this.setClearBtnVisibility();
  }

  private readonly counters: Array<InstanceType<typeof Counter>>;

  private readonly clearBtnContainer = pipe(this.container, H.querySelector<HTMLButtonElement>('.js-counters-dropdown__clear-btn'));

  private readonly applyBtnContainer = pipe(this.container, H.querySelector<HTMLButtonElement>('.js-counters-dropdown__apply-btn'));

  private readonly list = pipe(this.container, H.querySelectorAll<HTMLLIElement>('.js-counters-dropdown__item'));

  private countersData = pipe(
    this.list,
    A.map(H.prop('dataset')),
    A.reduce({} as Namespace.CountersData, (acc, {name, value, plurals, min}) => ({
      ...acc, [name as string]: {
        value: Number(value as string),
        plurals: pipe(plurals as string, JSON.parse),
        min: Number(min as string)
      }
    }))
  );

  private readonly initCounters = () => pipe(this.list, A.map((item) => pipe(Counter, H.instance(item, {
    onChange: this.handleCounterChange(item)
  }))));

  private readonly sendCountersData = () => this.props.onChange(this.countersData);

  private readonly resetCountersData = () => {
    pipe(this.counters, A.map(H.method('reset')));

    this.sendCountersData();
  };

  private readonly setClearBtnVisibility = () => {
    const isHidden = pipe(this.countersData, H.values, A.map(({value, min}) => pipe(value, H.sub(min), Boolean)), H.includes(true), H.not);

    pipe(this.clearBtnContainer, O.map(pipe(['counters-dropdown__control-btn_is_hidden'], isHidden
      ? H.addClassList : H.removeClassList)));
  };

  private readonly handleCounterChange = (item: HTMLLIElement) => (value: number) => {
    const name = item.dataset.name as string;

    this.countersData = {...this.countersData, [name]: {...this.countersData[name], value}};

    pipe(O.isNone(this.applyBtnContainer) || O.isNone(this.clearBtnContainer), H.switchCases([
      [true, this.sendCountersData], [false, this.setClearBtnVisibility]
    ], F.constVoid));
  };

  private readonly initApplyBtn = () => pipe(this.applyBtnContainer, O.map(
    (btnContainer) => pipe(Button, H.instance(btnContainer, {onClick: this.sendCountersData}))
  ));

  private readonly initClearBtn = () => pipe(this.clearBtnContainer, O.map(
    (btnContainer) => pipe(Button, H.instance(btnContainer, {onClick: this.resetCountersData}))
  ));
}

export default CountersManager;