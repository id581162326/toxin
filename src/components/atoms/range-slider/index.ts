import Slider from 'nouislider';
import {flow, pipe} from 'fp-ts/function';
import * as A from 'fp-ts/Array';
import * as O from 'fp-ts/Option';
import Namespace from './namespace';
import * as H from 'globals/helpers';

class RangeSlider {
  constructor(private readonly wrap: HTMLElement, private readonly props: Namespace.Props) {
    this.initSlider();
  }

  private readonly field = pipe(this.wrap, H.querySelector<HTMLInputElement>('.js-range-slider__field'));
  private readonly inputWrap = pipe(this.wrap, H.querySelector<HTMLDivElement>('.js-range-slider__input'));

  private readonly initSlider = () => pipe(this.inputWrap, O.map((wrap) => Slider.create(wrap, {
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
  }).on('update', this.handleSliderChange)));

  private readonly getFieldValue = (values: Array<string | number>) => pipe(values, A.map((val) => `${val}₽`), H.join(' - '));

  private readonly setFieldValue = (values: Array<string | number>) => pipe(
    this.field,
    O.map(H.setAttribute('value', this.getFieldValue(values)))
  );

  private readonly handleSliderChange = (values: Array<string | number>) => {
    pipe(values, A.map(Number), (values) => this.props.onChange(values as [number, number]));

    this.setFieldValue(values);
  };
}

export default RangeSlider;