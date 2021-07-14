import * as F from 'fp-ts/function';
import {pipe} from 'fp-ts/function';
import * as O from 'fp-ts/Option';
import * as H from 'globals/helpers';
import * as A from 'fp-ts/Array';

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

  private readonly invalidData = {
    'invalid-data': {
      plurals: {one: 'invalid data', few: 'invalid data', many: 'invalid data'},
      value: 0,
      min: 0
    }
  };

  private readonly checkPluralsFormat = (plurals: any | { one: string, few: string, many: string }) => pipe(
    false, H.switchCases([
      [Boolean('one' in plurals && typeof plurals['one'] === 'string'), F.constFalse],
      [Boolean('few' in plurals && typeof plurals['few'] === 'string'), F.constFalse],
      [Boolean('many' in plurals && typeof plurals['many'] === 'string'), F.constFalse]
    ], F.constTrue)
  );

  private countersData: Namespace.CountersData = pipe(
    this.list,
    A.map(H.prop('dataset')),
    A.reduce({}, (acc, {name, value, plurals, min}) => pipe(
      name, O.fromNullable, O.chain((name) => pipe(value, O.fromNullable, O.chain(
        (value) => pipe(plurals, O.fromNullable, O.map(JSON.parse), O.chain(
          (plurals) => pipe(min, O.fromNullable, O.chain(
            (min) => this.checkPluralsFormat(plurals) ? O.some({
              [name]: {plurals, value: Number(value), min: Number(min)}
            }) : O.none)))))
      )), O.fold(() => ({...acc, ...this.invalidData}), (data) => ({...acc, ...data}))
    ))
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

  private readonly handleCounterChange = ({dataset}: HTMLLIElement) => (value: number) => {
    pipe(dataset.name, O.fromNullable, O.fold(
      () => this.setCountersData(value)('invalid-data'), this.setCountersData(value))
    );

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

  private readonly setCountersData = (value: number) => (name: string) => {
    const key = name in this.countersData ? name : 'invalid-data';

    this.countersData = {...this.countersData, [key]: {...this.countersData[key], value}};
  };
}

export default CountersManager;