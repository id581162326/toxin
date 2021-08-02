import {flow, pipe} from 'fp-ts/function';
import * as H from 'globals/helpers';
import * as A from 'fp-ts/Array';
import * as O from 'fp-ts/Option';
import {Option} from 'fp-ts/Option';
import * as R from 'fp-ts/Record';
import {plurals} from 'globals/utils';

import Button from 'atoms/button';
import CountersDropdown from 'molecules/counters-dropdown';
import DateDropdown from 'molecules/date-dropdown';

import Namespace from './namespace';

class Calculation {
  constructor(private readonly wrap: HTMLElement, private readonly props: Namespace.Props) {
    this.submitBtn = this.initSubmitBtn();
    this.initDateDropdown();
    this.initCountersDropdown();

    this.initRentPrice();
    this.initServicePrice();
    this.initDiscount();
    this.initAdditionalPrice();
    this.initGenericData();
  }

  private calculationData: Namespace.CalculationData = {};

  private dates: [Date, Date] = [new Date(), new Date()];

  private readonly submitBtn: Option<InstanceType<typeof Button>> = O.none;

  private readonly rentPriceEl = pipe(this.wrap, H.querySelectorAll<HTMLSpanElement>('.js-calculation__rent-price'));
  private readonly daysEl = pipe(this.wrap, H.querySelector<HTMLSpanElement>('.js-calculation__days'));
  private readonly discount = pipe(this.wrap, H.querySelector<HTMLSpanElement>('.js-calculation__discount'));
  private readonly sumPriceEl = pipe(this.wrap, H.querySelector<HTMLSpanElement>('.js-calculation__sum-price'));
  private readonly servicePriceEl = pipe(this.wrap, H.querySelector<HTMLSpanElement>('.js-calculation__service-price'));
  private readonly additionalPriceEl = pipe(this.wrap, H.querySelector<HTMLSpanElement>('.js-calculation__additional-price'));
  private readonly totalPriceEl = pipe(this.wrap, H.querySelector<HTMLSpanElement>('.js-calculation__total-price'));
  private readonly countersDropdownWrap = pipe(this.wrap, H.querySelector<HTMLDivElement>('.js-calculation__counters-dropdown'));
  private readonly dateDropdownWrap = pipe(this.wrap, H.querySelector<HTMLDivElement>('.js-calculation__date-dropdown'));
  private readonly submitBtnWrap = pipe(this.wrap, H.querySelector<HTMLDivElement>('.js-calculation__submit-btn'));

  private readonly initRentPrice = () => pipe(this.rentPriceEl, A.map(flow(
    this.setPriceDataFromEl('rent-price'), this.formatPriceEl
  )));

  private readonly initServicePrice = () => pipe(this.servicePriceEl, O.map(flow(
    this.setPriceDataFromEl('service-price'), this.formatPriceEl
  )));

  private readonly initAdditionalPrice = () => pipe(this.additionalPriceEl, O.map(flow(
    this.setPriceDataFromEl('additional-price'), this.formatPriceEl
  )));

  private readonly initDiscount = () => pipe(this.discount, O.map(flow(
    this.setPriceDataFromEl('discount'), this.formatPriceEl
  )));

  private readonly initGenericData = () => {
    this.updateDays();
    this.updateSumPrice();
    this.updateTotalPrice();
  };

  private readonly initSubmitBtn = () => pipe(this.submitBtnWrap, O.map((wrap) => new Button(wrap, {
    onClick: this.handleSubmit
  })));

  private readonly initCountersDropdown = () => pipe(this.countersDropdownWrap, O.map((wrap) => new CountersDropdown(
    wrap, {
      counters: [
        {label: 'Взрослые', name: 'adults', value: 0, min: 0, plural: plurals.guest},
        {label: 'Дети', name: 'children', value: 0, min: 0, plural: plurals.guest},
        {label: 'Младенцы', name: 'babies', value: 0, min: 0, plural: plurals.babies}
      ],
      onChange: this.handleGuestsChange
    }
  )));

  private readonly initDateDropdown = () => pipe(this.dateDropdownWrap, O.map((wrap) => new DateDropdown(
    wrap, {
      name: '_',
      onChange: this.handleDatesChange
    }
  )));

  private readonly updateSumPrice = () => {
    const sum = Number(this.calculationData['days']) * Number(this.calculationData['rent-price']);

    this.setCalculationData({'sum-price': sum});

    pipe(this.sumPriceEl, O.map(flow(pipe(sum, H.toString, H.setInnerText), this.formatPriceEl)));
  };

  private readonly updateTotalPrice = () => {
    const total = Number(this.calculationData['sum-price']) + Number(this.calculationData['additional-price'])
      + Number(this.calculationData['service-price']) - Number(this.calculationData['discount']);

    this.setCalculationData({'total-price': total});

    pipe(this.totalPriceEl, O.map(flow(pipe(total < 0 ? 0 : total, H.toString, H.setInnerText), this.formatPriceEl)));

    this.updateSubmitBtnDisabled();
  };

  private readonly updateDays = () => {
    const days = pipe(this.dates, A.map(flow(H.method('getTime'))), H.subAdjacent(1), H.toDays);

    this.setCalculationData({'days': days});

    pipe(this.daysEl, O.map(flow(pipe(days, H.toString, H.setInnerText))));
  };

  private readonly setPriceDataFromEl = (name: Namespace.DataNamesMap) => (el: HTMLSpanElement) => {
    this.setCalculationData({[name]: pipe(el.innerText, Number)});

    return (el);
  };

  private readonly formatPriceEl = (el: HTMLSpanElement) => {
    pipe(el, pipe(el.innerText, Number, H.currencyFormat, H.setInnerText));

    return (el);
  };

  private readonly setCalculationData = (data: Namespace.CalculationData) => this.calculationData = {...this.calculationData, ...data};

  private readonly updateSubmitBtnDisabled = () => {
    const disabled = !('adults' in this.calculationData && Number(this.calculationData['total-price']) > 0);
    pipe(this.submitBtn, O.map(H.method('setDisabled', disabled)));
  };

  private readonly handleSubmit = () => {
    this.props.onSubmit(this.calculationData);
  };

  private readonly handleGuestsChange = (data: Record<string, number>) => {
    pipe(data, R.mapWithIndex((key, counter) => counter > 0
      ? this.setCalculationData({[key]: counter})
      : delete this.calculationData[key]
    ));
    this.updateSubmitBtnDisabled();
  };

  private readonly handleDatesChange = (data: Record<string, Option<[Date, Date]>>) => {
    pipe(data, R.mapWithIndex((_, dates) => this.dates = O.isSome(dates)
      ? dates.value : [new Date(), new Date()]
    ));
    this.updateDays();
    this.updateSumPrice();
    this.updateTotalPrice();

    H.trace(this.calculationData);
  };
}

export default Calculation;