import {pipe} from 'fp-ts/function';
import * as O from 'fp-ts/Option';
import {Option} from 'fp-ts/Option';
import * as H from 'globals/helpers';
import * as R from 'fp-ts/Record';

import Datepicker from 'molecules/datepicker';

import Namespace from './namespace';
import controlsTemplate from './template.njk';

class DatepickerManager {
  constructor(private readonly wrap: HTMLElement, private readonly props: Namespace.Props) {
    this.renderControls();

    this.applyBtnWrap = pipe(wrap, H.querySelector<HTMLDivElement>('.js-date-dropdown__apply-btn'));
    this.clearBtnWrap = pipe(wrap, H.querySelector<HTMLDivElement>('.js-date-dropdown__clear-btn'));

    this.datepicker = this.initDatepicker();

    this.initApplyBtn();
    this.initClearBtn();
    this.setClearBtnVisibility();
    this.sendDates();
  }

  private selectedDates: Record<string, Option<[Date, Date]>> = {};
  private readonly datepickerWrap = pipe(this.wrap, H.querySelector<HTMLDivElement>('.js-date-dropdown__datepicker'));
  private readonly applyBtnWrap: Option<HTMLDivElement>;
  private readonly clearBtnWrap: Option<HTMLDivElement>;
  private readonly datepicker: Option<InstanceType<typeof Datepicker>>;

  private readonly renderControls = () => pipe(this.datepickerWrap, O.map((wrap) => {
    const {autoApply} = this.props;

    wrap.insertAdjacentHTML('beforeend', controlsTemplate({autoApply}));
  }));

  private readonly initDatepicker = () => pipe(this.datepickerWrap, O.map((wrap) => new Datepicker(wrap, {
    name: this.props.name,
    selected: this.props.selected,
    onSelect: this.handleDateSelect,
    onSelectionEnd: this.handleSelectionEnd
  })));

  private readonly initApplyBtn = () => pipe(this.applyBtnWrap, O.map(H.addEventListener('click', this.handleApply)));

  private readonly initClearBtn = () => pipe(this.clearBtnWrap, O.map(H.addEventListener('click', this.resetDatepicker)));

  private readonly setClearBtnVisibility = () => {
    pipe(this.selectedDates, R.map((dates) => {
      const isHidden = O.isNone(dates);

      pipe(this.clearBtnWrap, O.map(pipe(['date-dropdown__control-btn_is_hidden'], isHidden
        ? H.addClassList : H.removeClassList)));
    }));
  };

  private readonly sendDates = () => {
    this.props.onSelect(this.selectedDates);
  };

  private readonly resetDatepicker = () => {
    pipe(this.datepicker, O.map(H.method('reset')));

    this.sendDates();
  };

  private readonly handleDateSelect = (data: Record<string, Option<[Date, Date]>>) => {
    this.selectedDates = {...this.selectedDates, ...data};

    if (document.readyState === 'complete' && this.props.autoApply) {
      this.sendDates();
      return;
    }

    this.setClearBtnVisibility();
  };

  private readonly handleSelectionEnd = () => {
    if (document.readyState === 'complete' && this.props.autoApply) {
      this.props.onSelectionEnd();
    }
  };

  private readonly handleApply = () => {
    this.sendDates();
    this.props.onSelectionEnd();
  };
}

export default DatepickerManager;