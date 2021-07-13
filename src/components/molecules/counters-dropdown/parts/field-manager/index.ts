import {flow, pipe} from 'fp-ts/function';
import * as H from 'globals/helpers';
import * as A from 'fp-ts/Array';
import * as O from 'fp-ts/Option';

import Namespace from './namespace';

class FieldManager implements Namespace.Interface {
  public readonly setDisabled = (disabled: boolean) => {
    pipe(this.field, O.map(pipe('disabled', disabled ? H.setAttribute : H.removeAttribute)));

    return (this);
  };

  public readonly updateValue = (countersData: Namespace.CountersData) => {
    const value = pipe(countersData, this.sumCountersData, this.getValue);

    pipe(this.field, O.map(flow(H.setAttribute('value', value))));

    this.setFieldTitle(value);

    return (this);
  };

  constructor(private readonly container: HTMLElement) {
    this.initFieldTitleSideEffect();
  }

  private readonly field = pipe(this.container, H.querySelector<HTMLInputElement>('.js-counters-dropdown__input'));

  private readonly placeholder = pipe(this.field, O.chain(
    flow(H.prop('dataset'), H.prop('placeholder'), O.fromNullable)
  ), O.getOrElse(() => ' '));

  private readonly initFieldTitleSideEffect = () => pipe(window, H.addEventListener('load', this.handleWindowLoad));

  private readonly handleWindowLoad = () => pipe(this.field, O.map(flow(H.prop('value'), this.setFieldTitle)));

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
    A.reduce([] as Array<string>, (acc, {plurals, value}) => value > 0
      ? [...acc, `${value} ${H.pluralRule(plurals)(value)}`]
      : acc),
    (xs) => A.size(xs) === 0 ? this.placeholder : H.join(', ')(xs)
  );

  private readonly sumCountersData = (countersData: Namespace.CountersData) => pipe(countersData, this.chopOnChunks, this.sumChunks);

  private readonly chopOnChunks = (countersData: Namespace.CountersData) => pipe(countersData, A.chop((xs) => {
    const pluralsAreEquals = (x: Namespace.Plurals, y: Namespace.Plurals) => pipe(
      H.values(x),
      A.zip(H.values(y)),
      A.reduce(true as boolean, (acc, [x, y]) => x !== y ? false : acc)
    );

    const {init, rest} = pipe(xs, A.spanLeft((a) => pluralsAreEquals(a.plurals, xs[0].plurals)));
    return [init, rest];
  }));

  private readonly sumChunks = (chunks: Array<Namespace.CountersData>) => pipe(
    chunks, A.reduce([] as Namespace.CountersData, (acc, chunk) => [...acc, ...pipe(
      chunk, A.size(chunk) > 1 ? (chunk) => pipe(
        chunk,
        A.map(H.prop('value')),
        A.reduce(0, (prev, next) => prev + next),
        (value) => [{value, plurals: chunk[0].plurals}]
      ) : H.ident)]
    )
  );
}

export default FieldManager;