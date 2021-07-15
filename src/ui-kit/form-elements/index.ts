import {pipe} from 'fp-ts/function';
import * as A from 'fp-ts/Array';
import * as H from 'globals/helpers';

import TextField from 'atoms/text-field';
import Button from 'atoms/button';
import SubscribeField from 'atoms/subscribe-field';
import Checkbox from 'atoms/checkbox';
import RadioGroup from 'atoms/radio-group';
import LikeButton from 'atoms/like-button';
import RateBar from 'atoms/rate-bar';

import CountersDropdown from 'molecules/counters-dropdown';
import ExpandableCheckboxes from 'molecules/expandable-checkboxes';

import './style.css';

type InitTuple<Class extends { new(container: HTMLElement, ...params: any[]): any }> = [
  string, Class, ...(Class extends { new(container: HTMLElement, ...params: infer Params): any } ? Params : never)
]

const init = <Class extends { new(container: HTMLElement, ...params: any[]): any }>(
  [selector, Fn, ...params]: InitTuple<Class>
) => pipe(document, H.querySelectorAll<HTMLElement>(selector), A.map((container) => new Fn(container, ...params)));

init(['.js-ui-kit__field', TextField, {onChange: H.trace}]);
init(['.js-ui-kit__dropdown', CountersDropdown, {onChange: H.trace}]);
init(['.js-ui-kit__button', Button, {onClick: () => H.trace('Click!')}]);
init(['.js-ui-kit__subscribe-field', SubscribeField, {onSubmit: H.trace}]);
init(['.js-ui-kit__checkbox', Checkbox, {onChange: H.trace}]);
init(['.js-ui-kit__radio-group', RadioGroup, {onChange: H.trace}]);
init(['.js-ui-kit__like-button', LikeButton, {onChange: H.trace}]);
init(['.js-ui-kit__rate-bar', RateBar, {onChange: H.trace}]);
init(['.js-ui-kit__expandable-checkboxes', ExpandableCheckboxes, {onChange: H.trace}]);