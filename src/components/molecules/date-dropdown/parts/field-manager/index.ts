import Namespace from './namespace';
import {pipe} from 'fp-ts/function';
import * as H from 'globals/helpers';
import * as A from 'fp-ts/Array';

class FieldManager implements Namespace.Interface {
  public readonly setDisabled = (disabled: boolean) => {
    pipe(this.fields, A.map(pipe('disabled', disabled ? H.setAttribute : H.removeAttribute)));

    return (this);
  };

  public readonly updateValue = (dates?: [Date, Date]) => {
    A.size(this.fields) === 2 ? pipe(
      dates,
      this.getRangeValues,
      A.zip(this.fields), A.map(([value, field]) => pipe(field, H.setAttribute('value', value)))
    ) : pipe(
      dates,
      this.getSingleValue,
      (value) => pipe(this.fields, A.map(H.setAttribute('value', value)))
    );

    return (this);
  };

  constructor(private readonly wrap: HTMLElement) {
  }

  private readonly fields = pipe(this.wrap, H.querySelectorAll<HTMLInputElement>('.js-date-dropdown__button'));

  private readonly getRangeValues = (dates?: [Date, Date]) => dates
    ? pipe(dates, A.map(new Intl.DateTimeFormat('ru').format))
    : ['ДД.ММ.ГГГГ', 'ДД.ММ.ГГГГ'];

  private readonly getSingleValue = (dates?: [Date, Date]) => dates ? pipe(
    dates,
    A.map(new Intl.DateTimeFormat('ru', {day: 'numeric', month: 'short'}).format),
    H.join(' - ')
  ) : 'ДД.ММ - ДД.ММ';
}

export default FieldManager;