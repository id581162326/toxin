import {pipe} from 'fp-ts/function';
import * as A from 'fp-ts/Array';
import * as H from 'globals/helpers';

import TextField from 'shared/text-field';
import CountersDropdown from 'shared/counters-dropdown';
import Button from 'shared/button';
import SubscribeField from 'shared/subscribe-field';
import 'shared/checkbox';

import './style.css';
import Checkbox from 'shared/checkbox';

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