export type Plural = {one: string, few: string, many: string};

export const plurals: Record<string, Plural> = {
  'adults': {one: 'Взрослый', few: 'Взрослых', many: 'Взрослых' },
  'children': {one: 'Ребенок', few: 'Детей', many: 'Детей' },
  'guest': {one: 'Гость', few: 'Гостя', many: 'Гостей' },
  'babies': {one: 'Младенец', few: 'Младенцев', many: 'Младенцев' },
  'rooms': {one: 'Комната', few: 'Комнаты', many: 'Комнат' },
  'beds': {one: 'Кровать', few: 'Кровати', many: 'Кроватей' },
  'bathrooms': {one: 'Ванная комната', few: 'Ванных камнаты', many: 'Ванных комнат' }
}
