import * as O from 'fp-ts/Option';
import {Option} from 'fp-ts/Option';
import {flow, pipe} from 'fp-ts/function';
import * as H from 'globals/helpers';
import * as A from 'fp-ts/Array';

import Namespace from './namespace';

class FieldManager implements Namespace.Interface {
  public readonly setDisabled = (disabled: boolean) => {
    pipe(this.fields, A.map(pipe('disabled', disabled ? H.setAttribute : H.removeAttribute)));

    return (this);
  };

  public readonly updateValue = (dates: Option<[Date, Date]>) => {
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

  private readonly getRangeValues = (dates: Option<[Date, Date]>) => pipe(dates, O.fold(
    () => ['ДД.ММ.ГГГГ', 'ДД.ММ.ГГГГ'], A.map(new Intl.DateTimeFormat('ru').format)
  ));

  private readonly getSingleValue = (dates: Option<[Date, Date]>) => pipe(dates, O.fold(
    () => 'ДД.ММ - ДД.ММ',
    flow(A.map(new Intl.DateTimeFormat('ru', {day: 'numeric', month: 'short'}).format), H.join(' - '))
  ));
}

export default FieldManager;