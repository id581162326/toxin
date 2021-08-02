import {flow, pipe} from 'fp-ts/function';
import * as A from 'fp-ts/Array';
import * as O from 'fp-ts/Option';
import {Option} from 'fp-ts/Option';
import * as H from 'globals/helpers'

import Slider from 'nouislider';

import Namespace from './namespace';

class RangeSlider {
  constructor(private readonly wrap: HTMLElement, private readonly props: Namespace.Props) {
    this.slider = this.initSlider();
    this.setHandlesLabel();
  }

  private readonly slider: Option<ReturnType<typeof Slider.create>> = O.none;
  private readonly field = pipe(this.wrap, H.querySelector<HTMLInputElement>('.js-range-slider__field'));
  private readonly inputWrap = pipe(this.wrap, H.querySelector<HTMLDivElement>('.js-range-slider__input'));
  private readonly labelEl = pipe(this.wrap, H.querySelector<HTMLSpanElement>('.js-range-slider__label'));

  private readonly initSlider = () => pipe(this.inputWrap, O.map((wrap) => {
    const slider = Slider.create(wrap, {
      range: {
        min: this.props.range[0],
        max: this.props.range[1]
      },
      connect: true,
      start: this.props.initials,
      margin: this.props.margin,
      step: 500,
      cssPrefix: 'range-slider__',
      format: {
        from: flow(Number, Math.trunc),
        to: flow(Number, Math.trunc)
      }
    });

    slider.on('update', this.handleSliderChange);

    return (slider);
  }));

  private readonly setHandlesLabel = () => pipe(this.labelEl, O.map(({id}) => pipe(this.slider, O.map((slider) => {
    pipe(slider.getOrigins() as HTMLElement[], A.map(flow(
      H.querySelector<HTMLElement>('div'),
      O.map(H.setAttribute('aria-labelledby', id))
    )));
  }))));

  private readonly getFieldValue = (values: Array<string | number>) => pipe(values, A.map((val) => `${val}₽`), H.join(' - '));

  private readonly setFieldValue = (values: Array<string | number>) => pipe(
    this.field,
    O.map(H.setAttribute('value', this.getFieldValue(values)))
  );

  private readonly handleSliderChange = (values: Array<string | number>) => {
    pipe(values, A.map(Number), (values) => this.props.onChange({
      [this.props.name]: values as [number, number]
    }));

    this.setFieldValue(values);
  };
}

export default RangeSlider;