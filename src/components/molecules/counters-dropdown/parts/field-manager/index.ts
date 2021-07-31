import {flow, pipe} from 'fp-ts/function';
import * as H from 'globals/helpers';
import * as A from 'fp-ts/Array';
import * as O from 'fp-ts/Option';

import Namespace from './namespace';

class FieldManager implements Namespace.Interface {
  public readonly updateValue = (countersData: Namespace.CountersData) => {
    const value = pipe(countersData, this.sumCountersData, this.getValue);

    pipe(this.field, O.map(flow(H.setAttribute('value', value))));

    this.setFieldTitle(value);

    return (this);
  };

  constructor(private readonly wrap: HTMLElement) {
    this.initFieldTitleSideEffect();
  }

  private readonly field = pipe(this.wrap, H.querySelector<HTMLInputElement>('.js-counters-dropdown__button'));

  private readonly placeholder = pipe(this.field, O.chain(
    ({dataset}) => O.fromNullable(dataset.placeholder)
  ), O.getOrElse(() => ' '));

  private readonly initFieldTitleSideEffect = () => pipe(window, H.addEventListener('load', this.handleWindowLoad));

  private readonly getFieldSizeInChar = () => pipe(
    this.field,
    O.map(flow(H.prop('offsetWidth'), H.sub(59), H.mult(.125))),
    O.getOrElse(() => 0)
  );

  private readonly setFieldTitle = (title: string) => pipe(this.field, O.map(
    title.length > this.getFieldSizeInChar() ? H.setAttribute('title', title) : H.removeAttribute('title')
  ));

  private readonly getValue = (countersData: Namespace.CountersData) => pipe(
    countersData,
    A.reduce([] as Array<string>, (acc, {plural, value}) => value > 0
      ? [...acc, `${value} ${H.pluralize(plural)(value)}`]
      : acc),
    (xs) => A.size(xs) === 0 ? this.placeholder : H.join(', ')(xs)
  );

  private readonly sumCountersData = (countersData: Namespace.CountersData) => pipe(countersData, H.group(this.pluralAreEqual), this.sumChunks);

  private readonly pluralAreEqual = {
    equals: (x: ArrayElement<Namespace.CountersData>, y: ArrayElement<Namespace.CountersData>) => pipe(
      H.values(x.plural),
      A.zip(H.values(y.plural)),
      A.reduce(true as boolean, (acc, [x, y]) => x !== y ? false : acc)
    )
  };

  private readonly sumChunks = (chunks: Array<Namespace.CountersData>) => pipe(
    chunks, A.reduce([] as Namespace.CountersData, (acc, chunk) => [...acc, ...pipe(
      chunk, A.size(chunk) > 1 ? flow(
        A.map(H.prop('value')),
        A.reduce(0, (prev, next) => prev + next),
        (value) => [{value, plural: chunk[0].plural}]
      ) : H.ident)]
    )
  );

  private readonly handleWindowLoad = () => {
    pipe(this.field, O.map(flow(H.prop('value'), this.setFieldTitle)));

    H.removeEventListener('load', this.handleWindowLoad)(window);
  };
}

export default FieldManager;