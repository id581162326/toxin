import {pipe} from 'fp-ts/function';
import * as A from 'fp-ts/Array';
import * as H from 'globals/helpers';
import {plurals} from 'globals/utils';

import TextField from 'atoms/text-field';
import Button from 'atoms/button';
import SubscribeField from 'atoms/subscribe-field';
import Checkbox from 'atoms/checkbox';
import RadioGroup from 'atoms/radio-group';
import LikeButton from 'atoms/like-button';
import RateBar from 'atoms/rate-bar';

import CountersDropdown from 'molecules/counters-dropdown';
import ExpandableCheckboxes from 'molecules/expandable-checkboxes';
import DateDropdown from 'molecules/date-dropdown';

import './style.css';

type InitTuple<Class extends { new(container: HTMLElement, ...params: any[]): any }> = [
  string, Class, ...(Class extends { new(container: HTMLElement, ...params: infer Params): any } ? Params : never)
]

const init = <Class extends { new(container: HTMLElement, ...params: any[]): any }>(
  [selector, Fn, ...params]: InitTuple<Class>
) => pipe(document, H.querySelectorAll<HTMLElement>(selector), A.map((container) => new Fn(container, ...params)));

init(['.js-ui-kit__field', TextField, {onChange: H.trace}]);
init(['.js-ui-kit__dropdown_theme_guests', CountersDropdown, {
  counters: [
    {label: 'Взрослые', name: 'adults', value: 0, min: 0, plural: plurals.adults},
    {label: 'Дети', name: 'children', value: 0, min: 0, plural: plurals.children},
    {label: 'Младенцы', name: 'babies', value: 0, min: 0, plural: plurals.babies}
  ],
  onChange: H.trace
}]);
init(['.js-ui-kit__dropdown_theme_apartment', CountersDropdown, {
  counters: [
    {label: 'Комнаты', name: 'rooms', value: 1, min: 1, plural: plurals.rooms},
    {label: 'Кровати', name: 'beds', value: 0, min: 0, plural: plurals.beds},
    {label: 'Ванные комнаты', name: 'bathrooms', value: 0, min: 0, plural: plurals.bathrooms}
  ],
  autoApply: true,
  onChange: H.trace
}]);
init(['.js-ui-kit__button', Button, {onClick: () => H.trace('Click!')}]);
init(['.js-ui-kit__subscribe-field', SubscribeField, {onSubmit: H.trace}]);
init(['.js-ui-kit__checkbox', Checkbox, {onChange: H.trace}]);
init(['.js-ui-kit__radio-group', RadioGroup, {onChange: H.trace}]);
init(['.js-ui-kit__like-button', LikeButton, {onChange: H.trace}]);
init(['.js-ui-kit__rate-bar', RateBar, {onChange: H.trace}]);
init(['.js-ui-kit__expandable-checkboxes', ExpandableCheckboxes, {onChange: H.trace}]);
init(['.js-ui-kit__single-date-dropdown', DateDropdown, {}]);