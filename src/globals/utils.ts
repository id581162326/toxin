export type Plural = { one: string, few: string, many: string };

export const plurals: Record<string, Plural> = {
  'adults': {one: 'Взрослый', few: 'Взрослых', many: 'Взрослых'},
  'children': {one: 'Ребенок', few: 'Детей', many: 'Детей'},
  'guest': {one: 'Гость', few: 'Гостя', many: 'Гостей'},
  'babies': {one: 'Младенец', few: 'Младенцев', many: 'Младенцев'},
  'rooms': {one: 'Комната', few: 'Комнаты', many: 'Комнат'},
  'beds': {one: 'Кровать', few: 'Кровати', many: 'Кроватей'},
  'bathrooms': {one: 'Ванная комната', few: 'Ванных камнаты', many: 'Ванных комнат'}
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