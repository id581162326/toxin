import {pipe} from 'fp-ts/function';
import * as H from 'globals/helpers';
import * as O from 'fp-ts/Option';
import {Option} from 'fp-ts/Option';
import {plurals} from 'globals/utils';

import Button from 'atoms/button';

import DateDropdown from 'molecules/date-dropdown';
import CountersDropdown from 'molecules/counters-dropdown';

import Namespace from './namespace';

class SearchRoom {
  constructor(private readonly wrap: HTMLElement, private readonly props: Namespace.Props) {
    this.countersDropdown = this.initCountersDropdown();
    this.dateDropdown = this.initDateDropdown();
    this.initSubmitBtn();
  }

  private searchData: Namespace.SearchData = {
    guests: {adults: 0, children: 0, babies: 0},
    residence_time: O.none
  };

  private readonly countersDropdown: Option<InstanceType<typeof CountersDropdown>> = O.none;
  private readonly dateDropdown: Option<InstanceType<typeof DateDropdown>> = O.none;

  private readonly countersDropdownWrap = pipe(this.wrap, H.querySelector<HTMLDivElement>('.js-search-room__counters-dropdown'));
  private readonly dateDropdownWrap = pipe(this.wrap, H.querySelector<HTMLDivElement>('.js-search-room__date-dropdown'));
  private readonly submitBtnWrap = pipe(this.wrap, H.querySelector<HTMLDivElement>('.js-search-room__submit-btn'));

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
      onChange: this.handleResidenceTimeChange
    }
  )));

  private readonly initSubmitBtn = () => pipe(this.submitBtnWrap, O.map((wrap) => new Button(wrap, {
    onClick: this.handleSubmit
  })));

  private readonly setSearchData = (data: Partial<Namespace.SearchData>) => this.searchData = {...this.searchData, ...data};

  private readonly handleGuestsChange = (guests: Record<string, number>) => this.setSearchData({guests});

  private readonly handleResidenceTimeChange = (residence_time: Option<[Date, Date]>) => this.setSearchData({residence_time});

  private readonly handleSubmit = () => this.props.onSubmit(this.searchData);
}

export default SearchRoom;