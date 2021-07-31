import {pipe} from 'fp-ts/function';
import * as H from 'globals/helpers';
import * as O from 'fp-ts/Option';
import {plurals} from 'globals/utils';

import LikeButton from 'atoms/like-button';

import Namespace from './namespace';

class Review {
  constructor(private readonly wrap: HTMLElement, private readonly props: Namespace.Props) {
    this.initTime();
    this.initLikeBtn();
  }

  private readonly likeBtnWrap = pipe(this.wrap, H.querySelector<HTMLDivElement>('.js-review__like-btn'));
  private readonly timeEl = pipe(this.wrap, H.querySelector<HTMLTimeElement>('.js-review__time'));

  private readonly initTime = () => pipe(this.timeEl, O.map((el) => pipe(
    el.dateTime, Date.parse, H.sub(Date.now()), Math.abs, this.toDays, this.getTimeValue, H.setInnerText
  )(el)));

  private readonly initLikeBtn = () => pipe(this.likeBtnWrap, O.map((wrap) => new LikeButton(
    wrap, {onChange: this.props.onLikeChange}
  )));

  private readonly toDays = (timestamp: number) => pipe(timestamp, H.div(1000 * 60 * 60 * 24), Math.trunc);

  private readonly getTimeValue = (days: number) => pipe(true, H.switchCases([
    [days === 0, () => 'Сегодня'],
    [days === 1, () => 'Вчера']
  ], () => `${days} ${H.pluralize(plurals['days'])(days)} назад`));
}

export default Review;