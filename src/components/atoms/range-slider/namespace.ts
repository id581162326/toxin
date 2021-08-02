namespace RangeSlider {
  export interface Props {
    name: string,
    range: [number, number],
    initials: [number, number],
    margin: number,
    onChange: (values: Record<string, [number, number]>) => void
  }
}

export default RangeSlider;