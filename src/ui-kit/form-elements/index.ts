import {pipe} from 'fp-ts/function';
import * as A from 'fp-ts/Array';
import * as H from 'globals/helpers';

import TextField from 'atoms/text-field';
import Button from 'atoms/button';
import SubscribeField from 'atoms/subscribe-field';
import Checkbox from 'atoms/checkbox';
import RadioGroup from 'atoms/radio-group';
import LikeButton from 'atoms/like-button';

import CountersDropdown from 'molecules/counters-dropdown';

import './style.css';

pipe(
  document,
  H.querySelectorAll<HTMLDivElement>('.js-ui-kit__field'),
  A.map((container) => pipe(TextField, H.instance(container, {onChange: H.trace})))
);

pipe(
  document,
  H.querySelectorAll<HTMLDivElement>('.js-ui-kit__dropdown'),
  A.map((container) => pipe(CountersDropdown, H.instance(container, {onChange: H.trace})))
);

pipe(
  document,
  H.querySelectorAll<HTMLDivElement>('.js-ui-kit__button'),
  A.map((container) => pipe(Button, H.instance(container, {onClick: () => H.trace('Click!')})))
);

pipe(
  document,
  H.querySelectorAll<HTMLDivElement>('.js-ui-kit__subscribe-field'),
  A.map((container) => pipe(SubscribeField, H.instance(container, {onSubmit: H.trace})))
);

pipe(
  document,
  H.querySelectorAll<HTMLDivElement>('.js-ui-kit__checkbox'),
  A.map((container) => pipe(Checkbox, H.instance(container, {onChange: H.trace})))
);

pipe(
  document,
  H.querySelectorAll<HTMLDivElement>('.js-ui-kit__radio-group'),
  A.map((container) => pipe(RadioGroup, H.instance(container, {onChange: H.trace})))
);

pipe(
  document,
  H.querySelectorAll<HTMLDivElement>('.js-ui-kit__like-button'),
  A.map((container) => pipe(LikeButton, H.instance(container, {onChange: H.trace})))
);