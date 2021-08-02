export type Plural = { one: string, few: string, many: string };

type PluralNameMap = 'adult' | 'children' | 'guest' | 'baby' | 'room' | 'bed' | 'bathroom' | 'day_primary' | 'day_secondary';

export const plurals: Record<PluralNameMap, Plural> = {
  'adult': {one: 'взрослый', few: 'взрослых', many: 'взрослых'},
  'children': {one: 'ребенок', few: 'детей', many: 'детей'},
  'guest': {one: 'гость', few: 'гостя', many: 'гостей'},
  'baby': {one: 'младенец', few: 'младенцев', many: 'младенцев'},
  'room': {one: 'комната', few: 'комнаты', many: 'комнат'},
  'bed': {one: 'кровать', few: 'кровати', many: 'кроватей'},
  'bathroom': {one: 'ванная комната', few: 'ванных камнаты', many: 'ванных комнат'},
  'day_primary': {one: 'день', few: 'дня', many: 'дней'},
  'day_secondary': {one: 'сутки', few: 'суток', many: 'суток'}
};

export const monthNames = [
  'январь', 'февраль', 'март', 'апрель', 'май', 'июнь',
  'июль', 'август', 'сентябрь', 'октябрь', 'ноябрь', 'декабрь'
];

export const emailRegexp = /^([a-zA-Z0-9_.-])+@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,4})+$/;

export const dateRegexp = /^(0?[1-9]|[12][0-9]|3[01])[.](0?[1-9]|1[012])[.]\d{4}$/;

export const today = (() => {
  const now = new Date();

  now.setHours(0);
  now.setMinutes(0);
  now.setMilliseconds(0);
  now.setSeconds(0);

  return (now);
})();