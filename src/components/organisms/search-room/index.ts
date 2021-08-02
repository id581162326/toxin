import {pipe} from 'fp-ts/function';
import * as H from 'globals/helpers';
import * as O from 'fp-ts/Option';
import {Option} from 'fp-ts/Option';
import {plurals} from 'globals/utils';
import * as R from 'fp-ts/Record';
import * as A from 'fp-ts/Array';

import Button from 'atoms/button';

import DateDropdown from 'molecules/date-dropdown';
import CountersDropdown from 'molecules/counters-dropdown';

import Namespace from './namespace';

class SearchRoom {
  constructor(private readonly wrap: HTMLElement, private readonly props: Namespace.Props) {
    this.submitBtn = this.initSubmitBtn();
    this.initCountersDropdown();
    this.initDateDropdown();
  }

  private searchData: Namespace.SearchData = {};

  private readonly submitBtn: Option<InstanceType<typeof Button>> = O.none;

  private readonly countersDropdownWrap = pipe(this.wrap, H.querySelector<HTMLDivElement>('.js-search-room__counters-dropdown'));
  private readonly dateDropdownWrap = pipe(this.wrap, H.querySelector<HTMLDivElement>('.js-search-room__date-dropdown'));
  private readonly submitBtnWrap = pipe(this.wrap, H.querySelector<HTMLDivElement>('.js-search-room__submit-btn'));

  private readonly initCountersDropdown = () => pipe(this.countersDropdownWrap, O.map((wrap) => new CountersDropdown(
    wrap, {
      counters: [
        {label: 'Взрослые', name: 'adults', value: 0, min: 0, plural: plurals['guest']},
        {label: 'Дети', name: 'children', value: 0, min: 0, plural: plurals['guest']},
        {label: 'Младенцы', name: 'babies', value: 0, min: 0, plural: plurals['baby']}
      ],
      onChange: this.handleGuestsChange
    }
  )));

  private readonly initDateDropdown = () => pipe(this.dateDropdownWrap, O.map((wrap) => new DateDropdown(
    wrap, {
      name: 'residence-time',
      onChange: this.handleResidenceTimeChange
    }
  )));

  private readonly initSubmitBtn = () => pipe(this.submitBtnWrap, O.map((wrap) => new Button(wrap, {
    onClick: this.handleSubmit
  })));

  private readonly setSearchData = (data: Namespace.SearchData) => this.searchData = {...this.searchData, ...data};

  private readonly updateSubmitBtnDisabled = () => {
    const disabled = !('adults' in this.searchData && 'residence-time' in this.searchData);
    pipe(this.submitBtn, O.map(H.method('setDisabled', disabled)));
  };

  private readonly handleGuestsChange = (data: Record<string, number>) => {
    pipe(data, R.mapWithIndex((key, counter) => counter > 0
      ? this.setSearchData({[key]: counter})
      : delete this.searchData[key]
    ));
    this.updateSubmitBtnDisabled();
  };

  private readonly handleResidenceTimeChange = (data: Record<string, Option<[Date, Date]>>) => {
    pipe(data, R.mapWithIndex((key, dates) => O.isSome(dates)
      ? this.setSearchData({[key]: pipe(dates.value, A.map(new Intl.DateTimeFormat('ru').format), H.join(' - '))})
      : delete this.searchData[key]
    ));
    this.updateSubmitBtnDisabled();
  };

  private readonly handleSubmit = () => {
    this.props.onSubmit(this.searchData);
  };
}

export default SearchRoom;