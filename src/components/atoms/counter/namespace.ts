namespace Counter {
  export interface Props {
    onChange: (value: number) => void,
    value?: number,
    min?: number,
    max?: number
  }

  export interface Interface {
    reset: () => this
  }
}

export default Counter;