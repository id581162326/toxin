export type Plural = { one: string, few: string, many: string };

export const plurals: Record<string, Plural> = {
  'adults': {one: 'взрослый', few: 'взрослых', many: 'взрослых'},
  'children': {one: 'ребенок', few: 'детей', many: 'детей'},
  'guest': {one: 'гость', few: 'гостя', many: 'гостей'},
  'babies': {one: 'младенец', few: 'младенцев', many: 'младенцев'},
  'rooms': {one: 'комната', few: 'комнаты', many: 'комнат'},
  'beds': {one: 'кровать', few: 'кровати', many: 'кроватей'},
  'bathrooms': {one: 'ванная комната', few: 'ванных камнаты', many: 'ванных комнат'},
  'days': {one: 'день', few: 'дня', many: 'дней'}
};

export const monthNames = [
  'январь', 'февраль', 'март', 'апрель', 'май', 'июнь',
  'июль', 'август', 'сентябрь', 'октябрь', 'ноябрь', 'декабрь'
];

export const emailRegexp = /^([a-zA-Z0-9_.-])+@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,4})+$/;

export const today = (() => {
  const now = new Date();

  now.setHours(0);
  now.setMinutes(0);
  now.setMilliseconds(0);
  now.setSeconds(0);

  return (now);
})();