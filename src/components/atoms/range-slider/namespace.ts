namespace RangeSlider {
  export interface Props {
    range: [number, number],
    initials: [number, number],
    margin: number,
    onChange: (values: [number, number]) => void
  }
}

export default RangeSlider;